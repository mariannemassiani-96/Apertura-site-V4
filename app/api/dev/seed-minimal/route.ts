import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const pool = getPgPool();

  const companyId = "22222222-2222-2222-2222-222222222222";
  const userId = "11111111-1111-1111-1111-111111111111";

  try {
    // 1) Company (structure minimale)
    await pool.query(
      `
      INSERT INTO companies (id, name)
      VALUES ($1, 'DEV COMPANY')
      ON CONFLICT (id) DO NOTHING
      `,
      [companyId]
    );

    // 2) User (colonnes EXACTES de portal_users)
    await pool.query(
      `
      INSERT INTO portal_users (
        id,
        company_id,
        email,
        name,
        role,
        password_hash,
        is_active,
        created_at
      )
      VALUES (
        $1,
        $2,
        'dev@apertura.local',
        'Dev User',
        'ADMIN',
        $3,
        true,
        now()
      )
      ON CONFLICT (id) DO NOTHING
      `,
      [
        userId,
        companyId,
        crypto.createHash("sha256").update("dev-password").digest("hex"),
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[seed-minimal] error:", e);
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}
