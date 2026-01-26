import { NextResponse } from "next/server";
import { requireProSession } from "@/lib/pro/guard";
import { getPgPool } from "@/lib/db/postgres";
import { generatePortalRef } from "@/lib/quotes/ref";
import { QuoteStatus } from "@/lib/quotes/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SocieteCode = "SIAL" | "ISULA";

// ✅ valeurs API acceptées (celles que tu envoies côté UI / tests)
type OrderTypeApi = "PARTICULIER" | "PRO" | "COLLECTIF";

// ✅ valeurs DB (contrainte CHECK)
type OrderTypeDb = "Particulier" | "Professionnel" | "Collectif";

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

function mapOrderTypeToDb(v: OrderTypeApi): OrderTypeDb {
  if (v === "PARTICULIER") return "Particulier";
  if (v === "PRO") return "Professionnel";
  return "Collectif";
}

export async function GET() {
  const { session, response } = requireProSession();
  if (response) return response;

  const companyId = session.companyId;
  if (!companyId) return jsonError(401, "Missing companyId");

  try {
    const pool = getPgPool();
    const { rows } = await pool.query(
      `
      SELECT
        id,
        portal_ref,
        societe_code,
        order_type,
        status,
        plm_project_id,
        created_at,
        updated_at
      FROM quote_requests
      WHERE company_id = $1
      ORDER BY created_at DESC
      LIMIT 200
      `,
      [companyId]
    );

    return NextResponse.json({ ok: true, quotes: rows });
  } catch (e: any) {
    console.error("[api/pro/quotes GET] error:", e);
    return jsonError(500, e?.message ?? "Server error");
  }
}

export async function POST(req: Request) {
  try {
    const { session, response } = requireProSession();
    if (response) return response;

    const companyId = session.companyId;
    const userId = session.userId;
    if (!companyId) return jsonError(401, "Missing companyId");
    if (!userId) return jsonError(401, "Missing userId");

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return jsonError(400, "Invalid JSON body");
    }

    const societeCode = body?.societe_code as SocieteCode;
    const orderTypeApi = body?.order_type as OrderTypeApi;

    if (!societeCode || !["SIAL", "ISULA"].includes(societeCode)) {
      return jsonError(400, "societe_code must be SIAL or ISULA");
    }
    if (!orderTypeApi || !["PARTICULIER", "PRO", "COLLECTIF"].includes(orderTypeApi)) {
      return jsonError(400, "order_type must be PARTICULIER | PRO | COLLECTIF");
    }

    const orderTypeDb = mapOrderTypeToDb(orderTypeApi);

    const status: QuoteStatus = "RECEIVED";
    const pool = getPgPool();

    const portalRef = await generatePortalRef({ societeCode });

    const { rows: inserted } = await pool.query(
      `
      INSERT INTO quote_requests (
        portal_ref,
        company_id,
        created_by_user_id,
        societe_code,
        order_type,
        status,
        plm_project_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,NULL)
      RETURNING *
      `,
      [portalRef, companyId, userId, societeCode, orderTypeDb, status]
    );

    const quote = inserted[0];

    await pool.query(
      `
      INSERT INTO quote_status_events (
        quote_request_id,
        from_status,
        to_status,
        changed_by_user_id,
        note
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [quote.id, null, status, userId, "Création de la demande"]
    );

    return NextResponse.json({ ok: true, quote });
  } catch (e: any) {
    console.error("[api/pro/quotes POST] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
