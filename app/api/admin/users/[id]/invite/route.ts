import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getPgPool } from "@/lib/db/postgres";
import { generateToken, sha256Hex } from "@/lib/auth/tokens";
import { createPasswordResetToken } from "@/lib/db/queries/invites";
import { dispatchEmail } from "@/lib/notify/dispatch";

function requireAdmin(session: any) {
  const role = session?.user?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const denied = requireAdmin(session);
  if (denied) return denied;

  const companyId = (session.user as any).companyId;
  const userId = ctx.params.id;

  // Récupérer user + vérifier même company
  const pool = getPgPool();
  const { rows } = await pool.query(
    `select id, email, name
     from portal_users
     where id=$1 and company_id=$2
     limit 1`,
    [userId, companyId]
  );

  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Token invitation (stocké hashé)
  const raw = generateToken(32);
  const tokenHash = sha256Hex(raw);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await createPasswordResetToken({ userId, tokenHash, expiresAt });

  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) return NextResponse.json({ error: "Missing NEXTAUTH_URL" }, { status: 500 });

  const link = `${baseUrl}/set-password?token=${raw}`;

  // ✅ Envoi via event + ctx (pas subject/html)
  await dispatchEmail({
    event: "USER_INVITE",
    to: [{ email: user.email, name: user.name || undefined }],
    ctx: {
      toName: user.name || user.email,
      inviteLink: link,
      companyName: "", // optionnel (on l'ajoutera plus tard si table companies a un champ name accessible)
    },
  });

  return NextResponse.json({ ok: true });
}
