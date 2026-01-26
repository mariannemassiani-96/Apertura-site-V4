import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const pool = getPgPool();
  const { rows } = await pool.query(
    `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'portal_users'
    ORDER BY ordinal_position
    `
  );

  return NextResponse.json({ ok: true, columns: rows });
}
