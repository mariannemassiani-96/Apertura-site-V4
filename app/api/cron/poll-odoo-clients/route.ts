import { NextResponse } from "next/server";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OdooCompanyCode = "SIAL" | "ISULA";

const CRON_SECRET = process.env.CRON_SECRET!;

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

const ODOO_COMPANY_SIAL_ID = Number(process.env.ODOO_COMPANY_SIAL_ID || "2");
const ODOO_COMPANY_ISULA_ID = Number(process.env.ODOO_COMPANY_ISULA_ID || "11");

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

// Limite de sécurité (évite de poll 500 clients par accident en dev)
const CLIENTS_LIMIT = Number(process.env.ODOO_CLIENTS_POLL_LIMIT || "50");

// Champs Odoo confirmés
const FIELD_ORDER_TYPE = "x_studio_type_de_commande";
const FIELD_DEVIS_SIGNED = "x_studio_devis_cgv_signes";
const FIELD_ETAPE_CHANTIER = "x_studio_etape_chantier";

const SCOPE = "ODDO_POLL_CLIENT";

/* ===================== Utils ===================== */
function assertCronAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${CRON_SECRET}`) throw new Error("Unauthorized");
}

function sha256(obj: any) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

/* ===================== DB helpers ===================== */
async function listClientCompanies(limit: number): Promise<Array<{ id: string; name: string; odoo_partner_id: number }>> {
  const rows = await sql`
    SELECT id, name, odoo_partner_id
    FROM companies
    WHERE odoo_partner_id IS NOT NULL
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as Array<{ id: string; name: string; odoo_partner_id: number }>;
}

async function getLastPayloadHash(args: {
  company_id: string;
  odoo_company_code: OdooCompanyCode;
  scope: string;
}): Promise<string | null> {
  const rows = await sql`
    SELECT payload_hash
    FROM odoo_snapshots
    WHERE company_id = ${args.company_id}
      AND odoo_company_code = ${args.odoo_company_code}
      AND scope = ${args.scope}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const typed = rows as { payload_hash: string }[];
  return typed.length ? typed[0].payload_hash : null;
}

async function insertSnapshot(args: {
  company_id: string; // UUID portail (client)
  odoo_company_code: OdooCompanyCode; // SIAL/ISULA
  scope: string; // ODDO_POLL_CLIENT
  payload: any;
  payload_hash: string;
}): Promise<boolean> {
  const rows = await sql`
    INSERT INTO odoo_snapshots (company_id, odoo_company_code, scope, payload, payload_hash, created_at)
    VALUES (${args.company_id}, ${args.odoo_company_code}, ${args.scope}, ${JSON.stringify(args.payload)}, ${args.payload_hash}, NOW())
    ON CONFLICT (company_id, odoo_company_code, scope, payload_hash) DO NOTHING
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

async function executeKw<T>(uid: number, model: string, method: string, args: any[], kwargs: any = {}): Promise<T> {
  return odooCall<T>({
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

async function searchCount(uid: number, model: string, domain: any[]): Promise<number> {
  return executeKw<number>(uid, model, "search_count", [domain]);
}

/* ===================== Domains (avec filtre client) ===================== */
// IMPORTANT : on filtre par partner_id child_of odoo_partner_id (client + contacts)
const D = {
  devisDraft: (odooCompanyId: number, odooPartnerId: number) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "draft"],
    ["partner_id", "child_of", odooPartnerId],
  ],
  devisSent: (odooCompanyId: number, odooPartnerId: number) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "sent"],
    ["partner_id", "child_of", odooPartnerId],
  ],
  devisTotal: (odooCompanyId: number, odooPartnerId: number) => [
    ["company_id", "=", odooCompanyId],
    ["state", "in", ["draft", "sent"]],
    ["partner_id", "child_of", odooPartnerId],
  ],
  aSigner: (odooCompanyId: number, odooPartnerId: number) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "sent"],
    ["partner_id", "child_of", odooPartnerId],
    "|",
    [FIELD_DEVIS_SIGNED, "=", false],
    [FIELD_DEVIS_SIGNED, "=", null],
  ],
  commandes: (odooCompanyId: number, odooPartnerId: number) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "sale"],
    ["partner_id", "child_of", odooPartnerId],
  ],
  devisByType: (odooCompanyId: number, odooPartnerId: number, type: string) => [
    ["company_id", "=", odooCompanyId],
    ["state", "in", ["draft", "sent"]],
    ["partner_id", "child_of", odooPartnerId],
    [FIELD_ORDER_TYPE, "=", type],
  ],
  commandesByType: (odooCompanyId: number, odooPartnerId: number, type: string) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "sale"],
    ["partner_id", "child_of", odooPartnerId],
    [FIELD_ORDER_TYPE, "=", type],
  ],
  etape: (odooCompanyId: number, odooPartnerId: number, value: string) => [
    ["company_id", "=", odooCompanyId],
    ["state", "=", "sale"],
    ["partner_id", "child_of", odooPartnerId],
    [FIELD_ETAPE_CHANTIER, "=", value],
  ],
};

async function computeSnapshotForClient(args: {
  uid: number;
  portalCompanyId: string;
  portalCompanyName: string;
  odooPartnerId: number;
  odooCompanyCode: OdooCompanyCode;
  odooCompanyId: number;
}) {
  const { uid, portalCompanyId, portalCompanyName, odooPartnerId, odooCompanyCode, odooCompanyId } = args;

  const [
    devisDraft,
    devisSent,
    devisTotal,
    aSigner,
    commandesTotal,
    devisPart,
    devisPro,
    devisColl,
    cmdPart,
    cmdPro,
    cmdColl,
    pretALivrer,
    livre,
    pose,
  ] = await Promise.all([
    searchCount(uid, "sale.order", D.devisDraft(odooCompanyId, odooPartnerId)),
    searchCount(uid, "sale.order", D.devisSent(odooCompanyId, odooPartnerId)),
    searchCount(uid, "sale.order", D.devisTotal(odooCompanyId, odooPartnerId)),
    searchCount(uid, "sale.order", D.aSigner(odooCompanyId, odooPartnerId)),

    searchCount(uid, "sale.order", D.commandes(odooCompanyId, odooPartnerId)),

    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, odooPartnerId, "Particulier")),
    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, odooPartnerId, "Professionnel")),
    searchCount(uid, "sale.order", D.devisByType(odooCompanyId, odooPartnerId, "Collectif")),

    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, odooPartnerId, "Particulier")),
    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, odooPartnerId, "Professionnel")),
    searchCount(uid, "sale.order", D.commandesByType(odooCompanyId, odooPartnerId, "Collectif")),

    // Règle: Livraison confirmée = "Prêt à livrer"
    searchCount(uid, "sale.order", D.etape(odooCompanyId, odooPartnerId, "Prêt à livrer")),
    searchCount(uid, "sale.order", D.etape(odooCompanyId, odooPartnerId, "Livré")),
    searchCount(uid, "sale.order", D.etape(odooCompanyId, odooPartnerId, "Posé")),
  ]);

  const payload = {
    source: "odoo_poll_client",
    at: new Date().toISOString(),
    portal: { companyId: portalCompanyId, companyName: portalCompanyName },
    odoo: { partnerId: odooPartnerId, companyCode: odooCompanyCode, companyId: odooCompanyId },
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

  // Fingerprint stable (pas de dates)
  const fingerprint = {
    portalCompanyId,
    odooCompanyCode,
    scope: SCOPE,
    kpis: payload.kpis,
  };

  const payload_hash = sha256(fingerprint);

  return { payload, payload_hash };
}

export async function GET(req: Request) {
  try {
    assertCronAuth(req);

    const uid = await login();

    const clients = await listClientCompanies(CLIENTS_LIMIT);

    const inserted: Array<{ companyId: string; companyName: string; odoo_company_code: OdooCompanyCode }> = [];

    for (const client of clients) {
      const portalCompanyId = client.id;
      const portalCompanyName = client.name;
      const odooPartnerId = Number(client.odoo_partner_id);

      // SIAL
      {
        const { payload, payload_hash } = await computeSnapshotForClient({
          uid,
          portalCompanyId,
          portalCompanyName,
          odooPartnerId,
          odooCompanyCode: "SIAL",
          odooCompanyId: ODOO_COMPANY_SIAL_ID,
        });

        const lastHash = await getLastPayloadHash({
          company_id: portalCompanyId,
          odoo_company_code: "SIAL",
          scope: SCOPE,
        });

        if (lastHash !== payload_hash) {
          const didInsert = await insertSnapshot({
            company_id: portalCompanyId,
            odoo_company_code: "SIAL",
            scope: SCOPE,
            payload,
            payload_hash,
          });
          if (didInsert) inserted.push({ companyId: portalCompanyId, companyName: portalCompanyName, odoo_company_code: "SIAL" });
        }
      }

      // ISULA
      {
        const { payload, payload_hash } = await computeSnapshotForClient({
          uid,
          portalCompanyId,
          portalCompanyName,
          odooPartnerId,
          odooCompanyCode: "ISULA",
          odooCompanyId: ODOO_COMPANY_ISULA_ID,
        });

        const lastHash = await getLastPayloadHash({
          company_id: portalCompanyId,
          odoo_company_code: "ISULA",
          scope: SCOPE,
        });

        if (lastHash !== payload_hash) {
          const didInsert = await insertSnapshot({
            company_id: portalCompanyId,
            odoo_company_code: "ISULA",
            scope: SCOPE,
            payload,
            payload_hash,
          });
          if (didInsert) inserted.push({ companyId: portalCompanyId, companyName: portalCompanyName, odoo_company_code: "ISULA" });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      scope: SCOPE,
      polledClients: clients.length,
      insertedCount: inserted.length,
      inserted,
    });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}
