export type CompanyCode = "SIAL" | "ISULA_VITRAGE";

export type ProRole = "ADMIN" | "COMMERCIAL" | "TECHNIQUE" | "COMPTABLE";

/**
 * Paramètres bloqués (gérés par Apertura).
 * Utilisés pour l’affichage + le gating permissions.
 */
export type AperturaLockedParams = {
  financeVisibility: boolean; // visibilité finance
  plmAccess: boolean; // accès PLM
  approAllowed: boolean; // APPRO autorisée
  allowedDeliveryModes: Array<"DEPOT" | "CHANTIER">; // livraison autorisée
};

export type ProUserSession = {
  userId: string;
  email: string;
  fullName?: string;

  companyId: string; // id interne portail (Entreprise)
  role: ProRole;

  /** sociétés Odoo autorisées pour ce compte (SIAL/ISULA VITRAGE) */
  allowedCompanies: CompanyCode[];

  /** paramètres bloqués (Apertura) */
  lockedParams: AperturaLockedParams;
};
