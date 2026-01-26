import { getPgPool } from "@/lib/db/postgres";

export type PortalRole = "ADMIN" | "COMMERCIAL" | "TECHNIQUE" | "COMPTABLE";

export async function listCompanyUsers(companyId: string) {
  const pool = getPgPool();
  const { rows } = await pool.query(
    `select id, company_id, email, name, role, is_active, created_at, last_login_at
     from portal_users
     where company_id=$1
     order by created_at asc`,
    [companyId]
  );
  return rows;
}

export async function createCompanyUser(params: {
  companyId: string;
  email: string;
  name: string;
  role: PortalRole;
  passwordHash: string;
}) {
  const pool = getPgPool();
  const { rows } = await pool.query(
    `insert into portal_users(company_id, email, name, role, password_hash, is_active)
     values ($1, $2, $3, $4, $5, true)
     returning id, company_id, email, name, role, is_active, created_at`,
    [params.companyId, params.email, params.name, params.role, params.passwordHash]
  );
  return rows[0];
}

export async function updateCompanyUser(params: {
  companyId: string;
  userId: string;
  name?: string;
  role?: PortalRole;
  isActive?: boolean;
}) {
  const pool = getPgPool();

  // Update partiel
  const fields: string[] = [];
  const values: any[] = [params.companyId, params.userId];
  let idx = 3;

  if (typeof params.name === "string") {
    fields.push(`name=$${idx++}`);
    values.push(params.name);
  }
  if (typeof params.role === "string") {
    fields.push(`role=$${idx++}`);
    values.push(params.role);
  }
  if (typeof params.isActive === "boolean") {
    fields.push(`is_active=$${idx++}`);
    values.push(params.isActive);
  }

  if (fields.length === 0) return null;

  const { rows } = await pool.query(
    `update portal_users
     set ${fields.join(", ")}
     where company_id=$1 and id=$2
     returning id, company_id, email, name, role, is_active, last_login_at`,
    values
  );

  return rows[0] ?? null;
}
