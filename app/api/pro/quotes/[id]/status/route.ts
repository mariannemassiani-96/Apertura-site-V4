import { NextResponse } from "next/server";
import { requireProSession } from "@/lib/pro/guard";
import { getPgPool } from "@/lib/db/postgres";
import { QUOTE_STATUS_NEXT, QUOTE_STATUSES, QuoteStatus } from "@/lib/quotes/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { session, response } = requireProSession();
  if (response) return response;

  const companyId = session.companyId;
  const userId = session.userId;
  if (!companyId) return jsonError(401, "Missing companyId");
  if (!userId) return jsonError(401, "Missing userId");

  const id = ctx.params?.id;
  if (!id) return jsonError(400, "Missing quote id");

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const toStatus = body?.to_status as QuoteStatus;
  const note = (body?.note ?? null) as string | null;

  if (!toStatus || !QUOTE_STATUSES.includes(toStatus)) {
    return jsonError(400, "Invalid to_status");
  }

  const pool = getPgPool();

  // 1) Charger le devis + check ownership + lock
  const { rows: quotes } = await pool.query(
    `
    SELECT id, status, locked_at
    FROM quote_requests
    WHERE id = $1 AND company_id = $2
    LIMIT 1
    `,
    [id, companyId]
  );

  const quote = quotes[0];
  if (!quote) return jsonError(404, "Quote not found");

  if (quote.locked_at) {
    return jsonError(409, "Quote is locked");
  }

  const fromStatus = quote.status as QuoteStatus;
  const expectedNext = QUOTE_STATUS_NEXT[fromStatus];

  // MVP: on n'autorise que "next"
  if (expectedNext !== toStatus) {
    return jsonError(400, `Invalid transition: ${fromStatus} -> ${toStatus}`);
  }

  // 2) Update statut
  await pool.query(
    `
    UPDATE quote_requests
    SET status = $1, updated_at = now()
    WHERE id = $2 AND company_id = $3
    `,
    [toStatus, id, companyId]
  );

  // 3) Insert event
  await pool.query(
    `
    INSERT INTO quote_status_events (quote_request_id, from_status, to_status, changed_by_user_id, note)
    VALUES ($1,$2,$3,$4,$5)
    `,
    [id, fromStatus, toStatus, userId, note]
  );

  return NextResponse.json({ ok: true, from_status: fromStatus, to_status: toStatus });
}
