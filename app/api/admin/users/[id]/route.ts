import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { updateCompanyUser } from "@/lib/db/queries/users";

function requireAdmin(session: any) {
  const role = session?.user?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const denied = requireAdmin(session);
  if (denied) return denied;

  const companyId = (session.user as any).companyId;
  const userId = ctx.params.id;

  const body = await req.json().catch(() => ({}));

  const updated = await updateCompanyUser({
    companyId,
    userId,
    name: typeof body.name === "string" ? body.name : undefined,
    role: typeof body.role === "string" ? body.role : undefined,
    isActive: typeof body.is_active === "boolean" ? body.is_active : undefined,
  });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: updated });
}
