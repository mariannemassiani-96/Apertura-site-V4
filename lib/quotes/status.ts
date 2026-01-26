export const QUOTE_STATUSES = [
  "RECEIVED",
  "QUALIFICATION",
  "STUDY",
  "SENT",
  "NEGOTIATION",
  "APPROVED",
  "ORDERED",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  RECEIVED: "Réception nouvelle demande",
  QUALIFICATION: "Qualification",
  STUDY: "Étude / chiffrage en cours",
  SENT: "Devis envoyé",
  NEGOTIATION: "Négociation / relances",
  APPROVED: "Validé → commande",
  ORDERED: "Commande créée",
};

export const QUOTE_STATUS_NEXT: Partial<Record<QuoteStatus, QuoteStatus>> = {
  RECEIVED: "QUALIFICATION",
  QUALIFICATION: "STUDY",
  STUDY: "SENT",
  SENT: "NEGOTIATION",
  NEGOTIATION: "APPROVED",
  APPROVED: "ORDERED",
};
