import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { insertDashboardSnapshot } from "@/lib/db/queries/snapshots";
import crypto from "node:crypto";

export async function POST(req: Request) {
  // DEV uniquement
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const url = new URL(req.url);

  // Option token (pour curl)
  const devToken = process.env.DEV_SNAPSHOT_TOKEN;
  if (devToken) {
    const token = url.searchParams.get("token") ?? "";
    if (token !== devToken) {
      return NextResponse.json({ error: "Forbidden (bad token)" }, { status: 403 });
    }
  } else {
    // Sinon session obligatoire
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => ({}));

  // Si tu ne passes pas companyId, on refuse (sinon on risquerait d’écrire au mauvais endroit)
  const companyId = body.companyId;
  if (!companyId) {
    return NextResponse.json(
      { error: "Missing companyId in body (required for curl token mode)" },
      { status: 400 }
    );
  }

  const odooCompanyCode = (body.odooCompanyCode === "ISULA" ? "ISULA" : "SIAL") as
    | "SIAL"
    | "ISULA";

  const payload = {
    kpis: {
      quotes: { pending: Number(body.pendingQuotes ?? 0), signed: Number(body.signedQuotes ?? 0) },
      orders: {
        toSign: Number(body.ordersToSign ?? 0),
        toPay: Number(body.ordersToPay ?? 0),
        inProgress: Number(body.ordersInProgress ?? 0),
      },
      deliveries: {
        upcoming: Number(body.upcomingDeliveries ?? 0),
        confirmed: Number(body.confirmedDeliveries ?? 0),
      },
      sav: { open: Number(body.openSav ?? 0) },
    },
  };

  const payloadHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload), "utf8")
    .digest("hex");

  const rec = await insertDashboardSnapshot({
    companyId,
    odooCompanyCode,
    payload,
    payloadHash,
  });

  return NextResponse.json({ ok: true, inserted: rec, payload });
}
