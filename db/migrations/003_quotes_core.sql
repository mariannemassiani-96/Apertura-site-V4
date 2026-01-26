-- 003_quotes_core.sql
-- Core "Devis" tables:
-- - quote_requests (dossiers devis)
-- - quote_status_events (historique statuts)
-- - quote_documents (pièces jointes)
--
-- Conventions:
-- - UUIDs via gen_random_uuid() (pgcrypto déjà activé dans 001_auth_and_legal.sql)
-- - created_at / updated_at
-- - verrouillage via locked_at + locked_by_user_id

BEGIN;

-- 1) quote_requests : dossier devis
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Référence métier unique portail
  portal_ref TEXT NOT NULL UNIQUE,

  -- rattachements
  company_id UUID NOT NULL,
  created_by_user_id UUID NOT NULL,

  -- société et type de commande
  societe_code TEXT NOT NULL CHECK (societe_code IN ('SIAL', 'ISULA')),
  order_type TEXT NOT NULL CHECK (order_type IN ('PARTICULIER', 'PRO', 'COLLECTIF')),

  -- statut devis (MVP)
  status TEXT NOT NULL CHECK (status IN (
    'RECEIVED',
    'QUALIFICATION',
    'STUDY',
    'SENT',
    'NEGOTIATION',
    'APPROVED',
    'ORDERED'
  )),

  -- futur: liaison PLM (phase suivante)
  origin TEXT NOT NULL DEFAULT 'PORTAL' CHECK (origin IN ('PORTAL', 'PLM')),
  plm_project_id TEXT NULL,

  -- verrouillage
  locked_at TIMESTAMPTZ NULL,
  locked_by_user_id UUID NULL,

  -- notes internes (optionnel)
  internal_note TEXT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index utiles (liste / filtres)
CREATE INDEX IF NOT EXISTS idx_quote_requests_company_created_at
  ON quote_requests (company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_requests_company_status
  ON quote_requests (company_id, status);

CREATE INDEX IF NOT EXISTS idx_quote_requests_societe
  ON quote_requests (societe_code);

-- Anti-doublon PLM (un projet PLM ne doit créer qu'un seul dossier devis)
CREATE UNIQUE INDEX IF NOT EXISTS uidx_quote_requests_plm_project_id
  ON quote_requests (plm_project_id)
  WHERE plm_project_id IS NOT NULL;

-- 2) quote_status_events : historique des changements de statut
CREATE TABLE IF NOT EXISTS quote_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID NOT NULL,

  from_status TEXT NULL,
  to_status TEXT NOT NULL CHECK (to_status IN (
    'RECEIVED',
    'QUALIFICATION',
    'STUDY',
    'SENT',
    'NEGOTIATION',
    'APPROVED',
    'ORDERED'
  )),

  changed_by_user_id UUID NOT NULL,
  note TEXT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_status_events_quote_created_at
  ON quote_status_events (quote_request_id, created_at ASC);

-- 3) quote_documents : documents rattachés au devis
CREATE TABLE IF NOT EXISTS quote_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID NOT NULL,

  doc_type TEXT NOT NULL CHECK (doc_type IN ('PLAN', 'PHOTO', 'DEVIS_PDF', 'CGV', 'AUTRE')),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),

  -- clé de stockage (S3/Vercel Blob/Cloudinary...)
  storage_key TEXT NOT NULL,

  uploaded_by_user_id UUID NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_documents_quote_created_at
  ON quote_documents (quote_request_id, created_at DESC);

-- Foreign keys (suppose tables companies + portal_users existent dans 001_auth_and_legal.sql)
ALTER TABLE quote_requests
  ADD CONSTRAINT fk_quote_requests_company
  FOREIGN KEY (company_id) REFERENCES companies(id)
  ON DELETE RESTRICT;

ALTER TABLE quote_requests
  ADD CONSTRAINT fk_quote_requests_created_by_user
  FOREIGN KEY (created_by_user_id) REFERENCES portal_users(id)
  ON DELETE RESTRICT;

ALTER TABLE quote_requests
  ADD CONSTRAINT fk_quote_requests_locked_by_user
  FOREIGN KEY (locked_by_user_id) REFERENCES portal_users(id)
  ON DELETE SET NULL;

ALTER TABLE quote_status_events
  ADD CONSTRAINT fk_quote_status_events_quote
  FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id)
  ON DELETE CASCADE;

ALTER TABLE quote_status_events
  ADD CONSTRAINT fk_quote_status_events_user
  FOREIGN KEY (changed_by_user_id) REFERENCES portal_users(id)
  ON DELETE RESTRICT;

ALTER TABLE quote_documents
  ADD CONSTRAINT fk_quote_documents_quote
  FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id)
  ON DELETE CASCADE;

ALTER TABLE quote_documents
  ADD CONSTRAINT fk_quote_documents_user
  FOREIGN KEY (uploaded_by_user_id) REFERENCES portal_users(id)
  ON DELETE RESTRICT;

COMMIT;
