import { NextResponse } from "next/server";
import { getProSessionFromRequest } from "./session";
import { PermissionKey, assertCan } from "./permissions";

export function requireProSession() {
  const session = getProSessionFromRequest();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };
  }
  return { session, response: null as NextResponse | null };
}

export function requirePermission(permission: PermissionKey) {
  const { session, response } = requireProSession();
  if (!session) return { session: null, response };

  try {
    assertCan(session, permission);
    return { session, response: null as NextResponse | null };
  } catch {
    return {
      session: null,
      response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }),
    };
  }
}
