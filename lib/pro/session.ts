import { ProUserSession } from "./types";

/**
 * MVP stub: plus tard -> lire un cookie/session NextAuth/iron-session/etc.
 * Pour l’instant: on fournit une session "fake" si variable DEV activée.
 */
export function getProSessionFromRequest(): ProUserSession | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (process.env.PRO_DEV_BYPASS !== "1") return null;

  return {
    userId: "dev-user",
    email: "dev@apertura.local",
    fullName: "Dev User",
    companyId: "dev-company",
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
