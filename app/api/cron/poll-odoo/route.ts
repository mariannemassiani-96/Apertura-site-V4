import { NextResponse } from "next/server";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SocieteKey = "SIAL" | "ISULA";

/* ===================== ENV ===================== */
const CRON_SECRET = process.env.CRON_SECRET!;

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

const ODOO_COMPANY_SIAL_ID = Number(process.env.ODOO_COMPANY_SIAL_ID || "2");
const ODOO_COMPANY_ISULA_ID = Number(process.env.ODOO_COMPANY_ISULA_ID || "11");

// ✅ Portal company UUIDs (dans ta DB)
const PORTAL_COMPANY_ID_SIAL = process.env.PORTAL_COMPANY_ID_SIAL!;
const PORTAL_COMPANY_ID_ISULA = process.env.PORTAL_COMPANY_ID_ISULA!;

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

/* ===================== Champs Odoo ===================== */
const FIELD_ORDER_TYPE = "x_studio_type_de_commande";
const FIELD_DEVIS_SIGNED = "x_studio_devis_cgv_signes";
const FIELD_ETAPE_CHANTIER = "x_studio_etape_chantier";

/* ===================== DB helpers (TON schéma) ===================== */
/**
 * Relit le dernier payload_hash pour un couple (odoo_company_code, scope)
 */
async function getLastPayloadHash(args: {
  odoo_company_code: SocieteKey;
  scope: string;
}): Promise<string | null> {
  const rows = await sql`
    SELECT payload_hash
    FROM odoo_snapshots
    WHERE odoo_company_code = ${args.odoo_company_code}
      AND scope = ${args.scope}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const typed = rows as { payload_hash: string }[];
  return typed.length ? typed[0].payload_hash : null;
}

/**
 * Insert idempotent. Retourne true si une ligne a été réellement insérée.
 * Nécessite un unique index sur (odoo_company_code, scope, payload_hash).
 */
async function insertSnapshot(args: {
  portal_company_id: string;
  odoo_company_code: SocieteKey;
  scope: string; // ex: "ODDO_POLL"
  payload: any;
  payload_hash: string;
}): Promise<boolean> {
  const rows = await sql`
    INSERT INTO odoo_snapshots (company_id, odoo_company_code, scope, payload, payload_hash, created_at)
    VALUES (
      ${args.portal_company_id},
      ${args.odoo_company_code},
      ${args.scope},
      ${JSON.stringify(args.payload)},
      ${args.payload_hash},
      NOW()
    )
    ON CONFLICT (odoo_company_code, scope, payload_hash) DO NOTHING
    RETURNING id
  `;

  return (rows as { id: number }[]).length > 0;
}

/* ===================== Odoo JSON-RPC ===================== */
async function odooCall<T>(params: any): Promise<T> {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params, id: crypto.randomUUID() }),
  });

  const text = await res.text().catch(() => "");
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Odoo returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) throw new Error(`Odoo HTTP ${res.status}`);
  if (json.error) throw new Error(`Odoo JSON-RPC error: ${JSON.stringify(json.error)}`);

  return json.result as T;
}

async function login(): Promise<number> {
  const uid = await odooCall<number>({
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  });
  if (!uid) throw new Error("Odoo authentication failed");
  return uid;
}

async function executeKw<T>(
  uid: number,
  model: string,
  method: string,
  args: any[],
  kwargs: any = {}
): Promise<T> {
  return odooCall<T>({
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

async function searchCount(uid: number, model: string, domain: any[]): Promise<number> {
  return executeKw<number>(uid, model, "search_count", [domain]);
}

/* ===================== Utils ===================== */
function sha256(obj: any) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

function assertCronAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${CRON_SECRET}`) throw new Error("Unauthorized");
}

/* ===================== Domains ===================== */
const D = {
  devisDraft: (companyId: number) => [["company_id", "=", companyId], ["state", "=", "draft"]],
  devisSent: (companyId: number) => [["company_id", "=", companyId], ["state", "=", "sent"]],
  devisTotal: (companyId: number) => [["company_id", "=", companyId], ["state", "in", ["draft", "sent"]]],
  aSigner: (companyId: number) => [
    ["company_id", "=", companyId],
    ["state", "=", "sent"],
    "|",
    [FIELD_DEVIS_SIGNED, "=", false],
    [FIELD_DEVIS_SIGNED, "=", null],
  ],
  commandes: (companyId: number) => [["company_id", "=", companyId], ["state", "=", "sale"]],
  devisByType: (companyId: number, type: string) => [
    ["company_id", "=", companyId],
    ["state", "in", ["draft", "sent"]],
    [FIELD_ORDER_TYPE, "=", type],
  ],
  commandesByType: (companyId: number, type: string) => [
    ["company_id", "=", companyId],
    ["state", "=", "sale"],
    [FIELD_ORDER_TYPE, "=", type],
  ],
  etape: (companyId: number, value: string) => [
    ["company_id", "=", companyId],
    ["state", "=", "sale"],
    [FIELD_ETAPE_CHANTIER, "=", value],
  ],
};

/* ===================== Snapshot builder ===================== */
async function computeSnapshotFor(uid: number, societe: SocieteKey, odooCompanyId: number) {
  const [devisDraft, devisSent, devisTotal, aSigner, commandesTotal] = await Promise.all([
    searchCount(uid, "sale.order", D.devisDraft(odooCompanyId)),
    searchCount(uid, "sale.order", D.devisSent(odooCompanyId)),
    searchCount(uid, "sale.order", D.devisTotal(odooCompanyId)),
    searchCount(uid, "sale.order", D.aSigner(odooCompanyId)),
    searchCount(uid, "sale.order", D.commandes(odooCompanyId)),
  ]);

  const [devisPart, devisPro, devisColl, cmdPart, cmdPro, cmdColl] = await Promise.all([
    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, "Particulier")),
    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, "Professionnel")),
    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, "Collectif")),
    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, "Particulier")),
    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, "Professionnel")),
    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, "Collectif")),
  ]);

  // ✅ Livraison confirmée = Prêt à livrer (ta règle)
  const [pretALivrer, livre, pose] = await Promise.all([
    searchCount(uid, "sale.order", D.etape(odooCompanyId, "Prêt à livrer")),
    searchCount(uid, "sale.order", D.etape(odooCompanyId, "Livré")),
    searchCount(uid, "sale.order", D.etape(odooCompanyId, "Posé")),
  ]);

  return {
    source: "odoo_poll",
    at: new Date().toISOString(),
    societe,
    odooCompanyId,
    kpis: {
      devis: { draft: devisDraft, sent: devisSent, total: devisTotal },
      aSigner,
      commandes: { total: commandesTotal },
      types: {
        devis: { Particulier: devisPart, Professionnel: devisPro, Collectif: devisColl },
        commandes: { Particulier: cmdPart, Professionnel: cmdPro, Collectif: cmdColl },
      },
      chantier: { pret_a_livrer: pretALivrer, livre, pose },
    },
  };
}

/* ===================== GET (cron) ===================== */
export async function GET(req: Request) {
  try {
    assertCronAuth(req);

    const uid = await login();

    const [sialSnap, isulaSnap] = await Promise.all([
      computeSnapshotFor(uid, "SIAL", ODOO_COMPANY_SIAL_ID),
      computeSnapshotFor(uid, "ISULA", ODOO_COMPANY_ISULA_ID),
    ]);

    const scope = "ODDO_POLL";
    const inserted: SocieteKey[] = [];

    const items: Array<{ snap: any; portalCompanyId: string; code: SocieteKey }> = [
      { snap: sialSnap, portalCompanyId: PORTAL_COMPANY_ID_SIAL, code: "SIAL" },
      { snap: isulaSnap, portalCompanyId: PORTAL_COMPANY_ID_ISULA, code: "ISULA" },
    ];

    for (const item of items) {
      const fingerprint = { odoo_company_code: item.code, scope, kpis: item.snap.kpis };
      const payloadHash = sha256(fingerprint);
      const lastHash = await getLastPayloadHash({ odoo_company_code: item.code, scope });

      if (lastHash !== payloadHash) {
        const didInsert = await insertSnapshot({
          portal_company_id: item.portalCompanyId,
          odoo_company_code: item.code,
          scope,
          payload: item.snap,
          payload_hash: payloadHash,
        });

        if (didInsert) inserted.push(item.code);
      }
    }

    return NextResponse.json({ ok: true, inserted, snapshots: { sial: sialSnap, isula: isulaSnap } });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}
