import { NextResponse } from "next/server";
import { getProSessionFromRequest } from "./session";
import { PermissionKey, assertCan } from "./permissions";
import { ProUserSession } from "./types";

type RequireProSessionResult =
  | { session: ProUserSession; response?: undefined }
  | { session: null; response: NextResponse };

export function requireProSession(): RequireProSessionResult {
  const session = getProSessionFromRequest();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };
  }

  return { session };
}

type RequirePermissionResult =
  | { session: ProUserSession; response?: undefined }
  | { session: null; response: NextResponse };

export function requirePermission(permission: PermissionKey): RequirePermissionResult {
  const result = requireProSession();
  if (result.response) return result;

  try {
    assertCan(result.session, permission);
    return { session: result.session };
  } catch {
    return {
      session: null,
      response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }),
    };
  }
}
