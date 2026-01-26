-- 003_fix_portal_sequences.sql
-- Répare/alimente portal_sequences pour matcher generatePortalRef():
-- societe_code TEXT, year INT, last_value INT, updated_at TIMESTAMPTZ

-- 0) S'assurer que la table existe (si elle n'existe pas, on la crée directement)
CREATE TABLE IF NOT EXISTS portal_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- 1) Renommer colonnes possibles -> societe_code
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='company_code')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='societe_code') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN company_code TO societe_code';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='societe')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='societe_code') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN societe TO societe_code';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='odoo_company_code')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='societe_code') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN odoo_company_code TO societe_code';
  END IF;
END $$;

-- 2) Renommer colonnes possibles -> year
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='annee')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='year') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN annee TO year';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='seq_year')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='year') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN seq_year TO year';
  END IF;
END $$;

-- 3) Renommer colonnes possibles -> last_value
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='counter')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='last_value') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN counter TO last_value';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='value')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portal_sequences' AND column_name='last_value') THEN
    EXECUTE 'ALTER TABLE portal_sequences RENAME COLUMN value TO last_value';
  END IF;
END $$;

-- 4) Ajouter les colonnes manquantes
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS societe_code TEXT;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS year INT;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS last_value INT NOT NULL DEFAULT 0;
ALTER TABLE portal_sequences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 5) Si year est NULL sur des lignes existantes, on met l'année courante
UPDATE portal_sequences
SET year = EXTRACT(YEAR FROM now())::int
WHERE year IS NULL;

-- 6) Ajouter un CHECK sur societe_code (sans planter si déjà présent)
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

-- 7) Index unique (societe_code, year)
CREATE UNIQUE INDEX IF NOT EXISTS uidx_portal_sequences_societe_year
  ON portal_sequences (societe_code, year);
