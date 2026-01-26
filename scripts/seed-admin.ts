import { getPgPool } from "../lib/db/postgres";
import { hashPassword } from "../lib/auth/passwords";

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "";
  const companyName = process.env.SEED_COMPANY_NAME || "Apertura (interne)";

  if (!email || !password) {
    throw new Error("Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD");
  }

  const pool = getPgPool();

  // 1️⃣ Company
  const companyRes = await pool.query(
    `insert into companies(name)
     values ($1)
     returning id`,
    [companyName]
  );
  const companyId = companyRes.rows[0].id;

  // 2️⃣ User
  const passwordHash = await hashPassword(password);

  await pool.query(
    `insert into portal_users(company_id, email, name, role, password_hash, is_active)
     values ($1, $2, $3, 'ADMIN', $4, true)
     on conflict(email) do update set
       company_id = excluded.company_id,
       role = 'ADMIN',
       password_hash = excluded.password_hash,
       is_active = true`,
    [companyId, email, "Admin Apertura", passwordHash]
  );

  console.log("✅ Seed admin OK:", email);
}

main().catch((e) => {
  console.error("❌ Seed admin failed:", e);
  process.exit(1);
});
