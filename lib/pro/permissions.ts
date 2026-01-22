import { ProRole, ProUserSession } from "./types";

export type PermissionKey =
  | "QUOTE_CREATE"
  | "QUOTE_VIEW"
  | "ORDER_VIEW"
  | "ORDER_SIGN"
  | "ORDER_SET_APPRO_COMMIT_DATE"
  | "DELIVERY_VIEW"
  | "FINANCE_VIEW"
  | "SAV_CREATE"
  | "DOCS_VIEW"
  | "PLM_VIEW";

type PermissionRule =
  | ProRole[]
  | ((session: ProUserSession, ctx?: Record<string, any>) => boolean);

export const PERMISSIONS: Record<PermissionKey, PermissionRule> = {
  QUOTE_CREATE: ["ADMIN", "COMMERCIAL"],
  QUOTE_VIEW: ["ADMIN", "COMMERCIAL", "TECHNIQUE", "COMPTABLE"],

  ORDER_VIEW: ["ADMIN", "COMMERCIAL", "TECHNIQUE", "COMPTABLE"],
  ORDER_SIGN: ["ADMIN"],

  ORDER_SET_APPRO_COMMIT_DATE: (s) =>
    (s.role === "TECHNIQUE" || s.role === "ADMIN") && s.lockedParams.approAllowed,

  DELIVERY_VIEW: ["ADMIN", "COMMERCIAL", "TECHNIQUE", "COMPTABLE"],

  FINANCE_VIEW: (s) =>
    (s.role === "COMPTABLE" || s.role === "ADMIN") && s.lockedParams.financeVisibility,

  SAV_CREATE: ["ADMIN", "TECHNIQUE"],

  DOCS_VIEW: ["ADMIN", "COMMERCIAL", "TECHNIQUE", "COMPTABLE"],

  PLM_VIEW: (s) => s.lockedParams.plmAccess,
};

export function can(
  session: ProUserSession,
  permission: PermissionKey,
  ctx?: Record<string, any>
): boolean {
  const rule = PERMISSIONS[permission];
  if (!rule) return false;

  if (Array.isArray(rule)) {
    return rule.includes(session.role);
  }
  return rule(session, ctx);
}

/**
 * Helper strict : lève une erreur si non autorisé (API routes)
 */
export function assertCan(
  session: ProUserSession,
  permission: PermissionKey,
  ctx?: Record<string, any>
) {
  if (!can(session, permission, ctx)) {
    const err = new Error("FORBIDDEN");
    // @ts-expect-error attach status
    err.status = 403;
    throw err;
  }
}
