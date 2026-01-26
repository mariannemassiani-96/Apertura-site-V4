-- 004_portal_sequences.sql
-- Séquences portail pour références métier: S-YYYY-000001 / I-YYYY-000001

BEGIN;

CREATE TABLE IF NOT EXISTS portal_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  societe_code TEXT NOT NULL CHECK (societe_code IN ('SIAL', 'ISULA')),
  year INT NOT NULL CHECK (year >= 2000),
  last_value INT NOT NULL DEFAULT 0 CHECK (last_value >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (societe_code, year)
);

COMMIT;

