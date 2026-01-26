import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getPgPool } from "@/lib/db/postgres";
// ✅ nouveau
import { getLatestClientSnapshot } from "@/lib/db/queries/snapshots";

type Kpis = {
  quotes: { pending: number; signed: number };
  orders: { toSign: number; toPay: number; inProgress: number };
  deliveries: { upcoming: number; confirmed: number };
  sav: { open: number };
};

function emptyKpis(): Kpis {
  return {
    quotes: { pending: 0, signed: 0 },
    orders: { toSign: 0, toPay: 0, inProgress: 0 },
    deliveries: { upcoming: 0, confirmed: 0 },
    sav: { open: 0 },
  };
}

function sumKpis(a: Kpis, b: Kpis): Kpis {
  return {
    quotes: { pending: a.quotes.pending + b.quotes.pending, signed: a.quotes.signed + b.quotes.signed },
    orders: {
      toSign: a.orders.toSign + b.orders.toSign,
      toPay: a.orders.toPay + b.orders.toPay,
      inProgress: a.orders.inProgress + b.orders.inProgress,
    },
    deliveries: {
      upcoming: a.deliveries.upcoming + b.deliveries.upcoming,
      confirmed: a.deliveries.confirmed + b.deliveries.confirmed,
    },
    sav: { open: a.sav.open + b.sav.open },
  };
}

/**
 * Accepte:
 * - ancien payload.kpis = { quotes, orders, deliveries, sav }
 * - nouveau payload.kpis = { devis, aSigner, commandes, chantier, types }
 */
function kpisFromSnapshot(snapshot: any): Kpis {
  const k = snapshot?.payload?.kpis;
  if (!k) return emptyKpis();

  // ✅ Ancien format (seed/dev)
  if (k.quotes || k.orders || k.deliveries || k.sav) {
    return {
      quotes: { pending: Number(k.quotes?.pending ?? 0), signed: Number(k.quotes?.signed ?? 0) },
      orders: {
        toSign: Number(k.orders?.toSign ?? 0),
        toPay: Number(k.orders?.toPay ?? 0),
        inProgress: Number(k.orders?.inProgress ?? 0),
      },
      deliveries: { upcoming: Number(k.deliveries?.upcoming ?? 0), confirmed: Number(k.deliveries?.confirmed ?? 0) },
      sav: { open: Number(k.sav?.open ?? 0) },
    };
  }

  // ✅ Nouveau format (poll Odoo)
  // - quotes.pending = devis.total
  // - quotes.signed = (devis.sent - aSigner) si tu veux approx "signés"
  // - orders.toSign = aSigner
  // - orders.inProgress = commandes.total
  // - deliveries.confirmed = chantier.pret_a_livrer (ta règle: "Livraison confirmée = Prêt à livrer")
  const devisDraft = Number(k.devis?.draft ?? 0);
  const devisSent = Number(k.devis?.sent ?? 0);
  const devisTotal = Number(k.devis?.total ?? (devisDraft + devisSent));

  const aSigner = Number(k.aSigner ?? 0);
  const commandesTotal = Number(k.commandes?.total ?? 0);

  const pretALivrer = Number(k.chantier?.pret_a_livrer ?? 0);
  // livre/pose dispo si tu veux les afficher plus tard
  // const livre = Number(k.chantier?.livre ?? 0);
  // const pose = Number(k.chantier?.pose ?? 0);

  const signedApprox = Math.max(0, devisSent - aSigner);

  return {
    quotes: { pending: devisTotal, signed: signedApprox },
    orders: { toSign: aSigner, toPay: 0, inProgress: commandesTotal },
    deliveries: { upcoming: 0, confirmed: pretALivrer },
    sav: { open: 0 },
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pool = getPgPool();

  const user = {
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role,
  };

  const companyId = (session.user as any).companyId as string;

  let companyName: string | null = null;
  try {
    const { rows } = await pool.query(`select name from companies where id=$1 limit 1`, [companyId]);
    companyName = rows?.[0]?.name ?? null;
  } catch {
    companyName = null;
  }

  // ✅ ON LIT LES SNAPSHOTS ODOO_POLL GLOBAUX PAR CODE (pas par companyId user)
  const sialSnap = await getLatestClientSnapshot({ companyId, odooCompanyCode: "SIAL" });
  const isulaSnap = await getLatestClientSnapshot({ companyId, odooCompanyCode: "ISULA" });

  const kSIAL = sialSnap ? kpisFromSnapshot(sialSnap) : emptyKpis();
  const kISULA = isulaSnap ? kpisFromSnapshot(isulaSnap) : emptyKpis();
  const kTotal = sumKpis(kSIAL, kISULA);

  const alerts: Array<any> = [];

  if (!sialSnap && !isulaSnap) {
    alerts.push({
      id: "no-snapshots",
      level: "warning",
      title: "Statuts non disponibles",
      body: "Aucun snapshot Odoo n’a encore été enregistré. Active le cron polling pour alimenter le dashboard.",
      cta: { label: "Activer le cron (DEV)", href: "/api/cron/poll-odoo" },
    });
  } else {
    alerts.push({
      id: "snapshots-ok",
      level: "info",
      title: "Statuts synchronisés",
      body: `Dernier snapshot — SIAL: ${sialSnap?.created_at ?? "—"} / ISULA: ${isulaSnap?.created_at ?? "—"}`,
    });
  }

  return NextResponse.json({
    user,
    company: { id: companyId, name: companyName ?? "Entreprise" },
    kpisTotal: kTotal,
    kpisByCompany: { SIAL: kSIAL, ISULA: kISULA },
    snapshots: {
      SIAL: sialSnap?.created_at ?? null,
      ISULA: isulaSnap?.created_at ?? null,
    },
    alerts,
  });
}
