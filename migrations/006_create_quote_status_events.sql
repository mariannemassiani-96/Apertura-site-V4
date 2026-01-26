-- 006_create_quote_status_events.sql
-- Events de changement de statut pour les devis

CREATE TABLE IF NOT EXISTS quote_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  quote_request_id uuid NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,

  from_status text NULL,
  to_status text NOT NULL,

  changed_by_user_id uuid NULL REFERENCES portal_users(id),

  note text NULL,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_status_events_quote
  ON quote_status_events (quote_request_id, created_at);

