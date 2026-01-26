-- 005_align_quote_requests.sql
-- Align quote_requests columns with API expectations (safe / idempotent)

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'PORTAL';

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS plm_project_id TEXT;

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS internal_note TEXT;
