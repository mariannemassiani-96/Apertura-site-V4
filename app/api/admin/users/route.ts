import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { listCompanyUsers, createCompanyUser } from "@/lib/db/queries/users";
import { hashPassword } from "@/lib/auth/passwords";

function requireAdmin(session: any) {
  const role = session?.user?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const denied = requireAdmin(session);
  if (denied) return denied;

  const companyId = (session.user as any).companyId;
  const users = await listCompanyUsers(companyId);
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const denied = requireAdmin(session);
  if (denied) return denied;

  const companyId = (session.user as any).companyId;

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const role = String(body.role || "COMMERCIAL");

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }
  if (!["ADMIN", "COMMERCIAL", "TECHNIQUE", "COMPTABLE"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Mot de passe placeholder : sera remplacé via invitation
  const placeholder = await hashPassword(`temp-${Date.now()}-${Math.random()}`);

  const user = await createCompanyUser({
    companyId,
    email,
    name,
    role: role as any,
    passwordHash: placeholder,
  });

  return NextResponse.json({ user });
}
