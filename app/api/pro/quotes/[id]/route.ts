import { NextResponse } from "next/server";
import { requireProSession } from "@/lib/pro/guard";
import { getPgPool } from "@/lib/db/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const { session, response } = requireProSession();
    if (response) return response;

    const companyId = session.companyId;
    if (!companyId) return jsonError(401, "Missing companyId");

    const id = ctx.params?.id;
    if (!id) return jsonError(400, "Missing quote id");

    const pool = getPgPool();

    // 1) Quote (ownership check)
    const { rows: quotes } = await pool.query(
      `
      SELECT *
      FROM quote_requests
      WHERE id = $1 AND company_id = $2
      LIMIT 1
      `,
      [id, companyId]
    );

    const quote = quotes[0];
    if (!quote) return jsonError(404, "Quote not found");

    // 2) Events timeline (table peut ne pas exister sur certains env -> on protège)
    let events: any[] = [];
    try {
      const r = await pool.query(
        `
        SELECT
          id,
          from_status,
          to_status,
          changed_by_user_id,
          note,
          created_at
        FROM quote_status_events
        WHERE quote_request_id = $1
        ORDER BY created_at ASC
        `,
        [id]
      );
      events = r.rows;
    } catch (e: any) {
      console.warn("[api/pro/quotes/[id]] events query failed:", e?.message);
      events = [];
    }

    // 3) Documents (pareil: si pas encore créé)
    let documents: any[] = [];
    try {
      const r = await pool.query(
        `
        SELECT
          id,
          doc_type,
          filename,
          mime_type,
          size_bytes,
          storage_key,
          uploaded_by_user_id,
          created_at
        FROM quote_documents
        WHERE quote_request_id = $1
        ORDER BY created_at DESC
        `,
        [id]
      );
      documents = r.rows;
    } catch (e: any) {
      console.warn("[api/pro/quotes/[id]] documents query failed:", e?.message);
      documents = [];
    }

    return NextResponse.json({ ok: true, quote, events, documents });
  } catch (e: any) {
    console.error("[api/pro/quotes/[id]] crashed:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
