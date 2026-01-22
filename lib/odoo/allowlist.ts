/**
 * Allowlist stricte pour éviter tout accès “libre” à Odoo.
 * On itère au fur et à mesure du MVP.
 */
export const ALLOWED_MODELS = new Set([
  "crm.lead",
  "sale.order",
  "stock.picking",
  "account.move",
  "account.payment",
  "helpdesk.ticket",
]);

export const ALLOWED_METHODS = new Set(["search_read", "read", "create", "write"]);

/**
 * Champs autorisés par modèle (MVP minimal)
 * -> à enrichir par itérations
 */
export const ALLOWED_FIELDS: Record<string, string[]> = {
  "crm.lead": ["id", "name", "stage_id", "create_date", "write_date", "company_id"],
  "sale.order": ["id", "name", "state", "date_order", "amount_total", "company_id", "partner_id"],
  "stock.picking": ["id", "name", "state", "scheduled_date", "date_done", "company_id", "origin"],
  "account.move": ["id", "name", "state", "payment_state", "invoice_date", "invoice_date_due", "amount_total", "company_id"],
  "account.payment": ["id", "name", "state", "amount", "date", "company_id"],
  "helpdesk.ticket": ["id", "name", "stage_id", "create_date", "write_date", "company_id"],
};
