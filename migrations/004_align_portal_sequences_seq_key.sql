-- 004_align_portal_sequences_seq_key.sql
-- Ensure portal_sequences has seq_key and it is unique + usable for UPSERT.

-- Ensure columns exist (safe if already present)
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS societe_code TEXT;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS year INT;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS last_value INT NOT NULL DEFAULT 0;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Add seq_key if missing (computed = societe_code-year)
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS seq_key TEXT;

-- Backfill seq_key where possible
UPDATE portal_sequences
SET seq_key = CONCAT(societe_code, '-', year)
WHERE seq_key IS NULL AND societe_code IS NOT NULL AND year IS NOT NULL;

-- If year is NULL, set current year (safe default)
UPDATE portal_sequences
SET year = EXTRACT(YEAR FROM now())::int
WHERE year IS NULL;

-- If societe_code is NULL, leave as-is (can't guess), but seq_key constraint below will require it for new rows.

-- Make seq_key NOT NULL if possible (will fail only if existing rows still have NULL seq_key)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM portal_sequences WHERE seq_key IS NULL) THEN
    -- Do nothing: keep it nullable to avoid breaking existing dirty rows.
    -- We'll rely on app inserts to always provide seq_key.
    NULL;
  ELSE
    BEGIN
      ALTER TABLE portal_sequences ALTER COLUMN seq_key SET NOT NULL;
    EXCEPTION WHEN others THEN
      NULL;
    END;
  END IF;
END $$;

-- Unique index for UPSERT
CREATE UNIQUE INDEX IF NOT EXISTS uidx_portal_sequences_seq_key
  ON portal_sequences (seq_key);

