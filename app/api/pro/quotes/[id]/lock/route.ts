import { NextResponse } from "next/server";
import { requireProSession } from "@/lib/pro/guard";
import { getPgPool } from "@/lib/db/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(_: Request, ctx: { params: { id: string } }) {
  const { session, response } = requireProSession();
  if (response) return response;

  const companyId = session.companyId;
  const userId = session.userId;
  if (!companyId) return jsonError(401, "Missing companyId");
  if (!userId) return jsonError(401, "Missing userId");

  const id = ctx.params?.id;
  if (!id) return jsonError(400, "Missing quote id");

  const pool = getPgPool();

  const { rows } = await pool.query(
    `
    UPDATE quote_requests
    SET
      locked_at = now(),
      locked_by_user_id = $1,
      updated_at = now()
    WHERE id = $2
      AND company_id = $3
      AND locked_at IS NULL
    RETURNING id, locked_at, locked_by_user_id
    `,
    [userId, id, companyId]
  );

  if (!rows[0]) {
    return jsonError(404, "Quote not found or already locked");
  }

  return NextResponse.json({ ok: true, lock: rows[0] });
}
