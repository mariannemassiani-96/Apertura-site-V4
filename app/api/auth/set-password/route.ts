import { NextResponse } from "next/server";
import { sha256Hex } from "@/lib/auth/tokens";
import { consumePasswordResetToken, setUserPasswordHash } from "@/lib/db/queries/invites";
import { hashPassword } from "@/lib/auth/passwords";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  const password = String(body.password || "");

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  if (password.length < 10) return NextResponse.json({ error: "Password too short" }, { status: 400 });

  const tokenHash = sha256Hex(token);
  const consumed = await consumePasswordResetToken({ tokenHash });

  if (!consumed.ok) {
    return NextResponse.json({ error: `Token ${consumed.reason}` }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await setUserPasswordHash({ userId: consumed.userId, passwordHash });

  return NextResponse.json({ ok: true });
}
