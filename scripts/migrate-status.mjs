// scripts/migrate-status.mjs
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const { Client } = pg;

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL manquant");
    process.exit(1);
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id serial PRIMARY KEY,
      filename text NOT NULL UNIQUE,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  const { rows } = await client.query(
    `SELECT filename, applied_at FROM schema_migrations ORDER BY filename ASC`
  );

  console.log("📦 Applied migrations:");
  if (!rows.length) {
    console.log("  (none)");
  } else {
    for (const r of rows) {
      console.log(`  - ${r.filename} @ ${r.applied_at}`);
    }
  }

  await client.end();
}

main().catch((e) => {
  console.error("❌ Status failed:", e?.message || e);
  process.exit(1);
});
