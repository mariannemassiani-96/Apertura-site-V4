create extension if not exists pgcrypto;

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  odoo_partner_id integer,
  created_at timestamptz not null default now()
);

do $$ begin
  create type user_role as enum ('ADMIN', 'COMMERCIAL', 'TECHNIQUE', 'COMPTABLE');
exception
  when duplicate_object then null;
end $$;

create table if not exists portal_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  email text not null unique,
  name text,
  role user_role not null default 'COMMERCIAL',
  password_hash text not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

do $$ begin
  create type legal_doc_type as enum ('CGV_PORTAIL', 'CGV_VENTE');
exception
  when duplicate_object then null;
end $$;

create table if not exists legal_documents (
  id uuid primary key default gen_random_uuid(),
  type legal_doc_type not null,
  version text not null,
  published_at timestamptz not null default now(),
  url text,
  unique(type, version)
);

create table if not exists legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references portal_users(id) on delete cascade,
  legal_document_id uuid not null references legal_documents(id) on delete restrict,
  accepted_at timestamptz not null default now(),
  ip text,
  user_agent text,
  unique(user_id, legal_document_id)
);

create table if not exists password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references portal_users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_password_resets_user_id on password_resets(user_id);
create index if not exists idx_password_resets_expires on password_resets(expires_at);

