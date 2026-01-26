import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db/postgres";
import { authOptions } from "@/lib/auth/authOptions";
import { getLatestLegalDocs } from "@/lib/db/queries/legal";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const pool = getPgPool();

  const docs = await getLatestLegalDocs();
  if (docs.length === 0) {
    return NextResponse.json({ ok: true, message: "No legal docs found" });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const userAgent = req.headers.get("user-agent") || null;

  for (const doc of docs) {
    await pool.query(
      `
      insert into legal_acceptances(user_id, legal_document_id, ip, user_agent)
      values ($1, $2, $3, $4)
      on conflict do nothing
      `,
      [userId, doc.id, ip, userAgent]
    );
  }

  // ✅ debug utile : renvoyer acceptedCount pour vérifier
  const { rows: check } = await pool.query(
    `
    select count(*)::int as count
    from legal_acceptances
    where user_id = $1
      and legal_document_id = any($2::uuid[])
    `,
    [userId, docs.map((d) => d.id)]
  );

  return NextResponse.json({ ok: true, acceptedCount: check[0]?.count, expected: docs.length });
}
