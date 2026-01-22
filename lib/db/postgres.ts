import { Pool } from "pg";

let pool: Pool | null = null;

export function getPgPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing env DATABASE_URL");

    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}
