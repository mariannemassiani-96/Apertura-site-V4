import { ProUserSession } from "./types";

/**
 * MVP stub: plus tard -> lire un cookie/session NextAuth/iron-session/etc.
 * Pour l’instant: on fournit une session "fake" si variable DEV activée.
 */
export function getProSessionFromRequest(): ProUserSession | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (process.env.PRO_DEV_BYPASS !== "1") return null;

  return {
    userId: "11111111-1111-1111-1111-111111111111",
    email: "dev@apertura.local",
    fullName: "Dev User",
    companyId: "22222222-2222-2222-2222-222222222222",
    role: "ADMIN",
    allowedCompanies: ["SIAL", "ISULA_VITRAGE"],
    lockedParams: {
      financeVisibility: true,
      plmAccess: false,
      approAllowed: true,
      allowedDeliveryModes: ["DEPOT", "CHANTIER"],
    },
  };
}
