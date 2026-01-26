-- 003_fix_portal_sequences.sql
-- Align portal_sequences table with expected schema used by generatePortalRef():
--   societe_code TEXT, year INT, last_value INT, updated_at TIMESTAMPTZ
-- Works even if the table already exists with different column names.

BEGIN;

-- 1) Rename common alternative column names -> societe_code
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='company_code'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='societe_code'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN company_code TO societe_code';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='societe'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='societe_code'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN societe TO societe_code';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='odoo_company_code'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='societe_code'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN odoo_company_code TO societe_code';
  END IF;
END $$;

-- 2) Rename common alternative column names -> year
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='annee'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='year'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN annee TO year';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='seq_year'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='year'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN seq_year TO year';
  END IF;
END $$;

-- 3) Rename common alternative column names -> last_value
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='counter'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='last_value'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN counter TO last_value';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='value'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='portal_sequences' AND column_name='last_value'
  ) THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN value TO last_value';
  END IF;
END $$;

-- 4) Ensure required columns exist
ALTER TABLE portal_sequences
  ADD COLUMN IF NOT EXISTS societe_code TEXT;

ALTER TABLE portal_sequences
  ADD COLUMN IF NOT EXISTS year INT;

ALTER TABLE portal_sequences
  ADD COLUMN IF NOT EXISTS last_value INT NOT NULL DEFAULT 0;

ALTER TABLE portal_sequences
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 5) Add CHECK constraint on societe_code (ignore if already exists)
DO $$
BEGIN
  BEGIN
    ALTER TABLE portal_sequences
      ADD CONSTRAINT portal_sequences_societe_code_check
      CHECK (societe_code IN ('SIAL','ISULA'));
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- 6) If year is still NULL for existing rows, set current year (safe default)
UPDATE portal_sequences
SET year = EXTRACT(YEAR FROM now())::int
WHERE year IS NULL;

-- 7) Ensure uniqueness on (societe_code, year) only if both columns exist now (they do)
CREATE UNIQUE INDEX IF NOT EXISTS uidx_portal_sequences_societe_year
  ON portal_sequences (societe_code, year);

COMMIT;
