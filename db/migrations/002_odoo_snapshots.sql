create table if not exists odoo_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,

  -- Société Odoo : SIAL / ISULA_VITRAGE (on harmonise en code)
  odoo_company_code text not null,

  -- type du snapshot (dashboard, quotes, orders... pour évoluer)
  scope text not null default 'DASHBOARD',

  -- payload JSON brut (MVP)
  payload jsonb not null,

  -- pour éviter de spammer : on peut stocker un hash
  payload_hash text not null,

  created_at timestamptz not null default now()
);

create index if not exists idx_odoo_snapshots_company_scope
  on odoo_snapshots(company_id, odoo_company_code, scope, created_at desc);
