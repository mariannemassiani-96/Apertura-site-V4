import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const pool = getPgPool();

  const tables = ["quote_requests", "quote_status_events", "quote_documents"];

  const results: Record<string, any> = {};

  for (const t of tables) {
    const { rows } = await pool.query(
      `
      select to_regclass($1) as regclass
      `,
      [t]
    );
    results[t] = rows[0]?.regclass;
  }

  return NextResponse.json({
    ok: true,
    tables: results,
  });
}
