-- Séquences par (prefixe + année) => ex: S-2026 / I-2026
CREATE TABLE IF NOT EXISTS portal_sequences (
  seq_key text PRIMARY KEY,
  current integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Dossiers devis (Portail)
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Référence maître: S-YYYY-000001 / I-YYYY-000001
  portal_ref text NOT NULL UNIQUE,

  company_id uuid NOT NULL REFERENCES companies(id),
  created_by_user_id uuid NULL REFERENCES portal_users(id),

  societe_code text NOT NULL CHECK (societe_code IN ('SIAL','ISULA')),
  status text NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('Particulier','Professionnel','Collectif')),

  plm_project_id text NULL,
  plm_payload_hash text NULL,

  odoo_sale_order_id integer NULL,
  odoo_sale_order_name text NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Anti-doublon PLM (si plm_project_id présent)
CREATE UNIQUE INDEX IF NOT EXISTS quote_requests_company_plm_uq
ON quote_requests(company_id, plm_project_id)
WHERE plm_project_id IS NOT NULL;

