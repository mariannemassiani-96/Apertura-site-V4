// scripts/migrate.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" }); // si tu utilises .env.local
dotenv.config(); // fallback .env

const { Client } = pg;
const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d+_.+\.sql$/.test(f))
    .sort(); // 001_xxx.sql, 002_xxx.sql...
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id serial PRIMARY KEY,
      filename text NOT NULL UNIQUE,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function getAppliedMigrations(client) {
  const { rows } = await client.query(
    `SELECT filename, checksum, applied_at FROM schema_migrations ORDER BY filename ASC`
  );
  return rows;
}

async function applyMigration(client, filename, sql) {
  await client.query("BEGIN");
  try {
    await client.query(sql);
    const checksum = sha256(sql);
    await client.query(
      `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`,
      [filename, checksum]
    );
    await client.query("COMMIT");
    return checksum;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
}

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL manquant (mets-le dans .env.local ou variables Codespaces)");
    process.exit(1);
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // OK pour Neon en scripts CLI
  });

  console.log("🔌 Connecting to DB...");
  await client.connect();
  console.log("✅ Connected");

  await ensureMigrationsTable(client);

  const files = listMigrationFiles();
  if (!files.length) {
    console.log("ℹ️ Aucun fichier de migration trouvé dans /migrations");
    await client.end();
    return;
  }

  const applied = await getAppliedMigrations(client);
  const appliedMap = new Map(applied.map((m) => [m.filename, m.checksum]));

  console.log(`📂 Found ${files.length} migration(s). Already applied: ${applied.length}`);

  for (const f of files) {
    const full = path.join(MIGRATIONS_DIR, f);
    const sql = fs.readFileSync(full, "utf8");
    const checksum = sha256(sql);

    if (appliedMap.has(f)) {
      const old = appliedMap.get(f);
      if (old !== checksum) {
        console.error(
          `❌ Migration déjà appliquée mais modifiée: ${f}\n` +
            `   checksum DB=${old}\n   checksum file=${checksum}\n` +
            `   ➜ Ne modifie jamais une migration appliquée. Crée une nouvelle migration.`
        );
        process.exit(1);
      }
      console.log(`⏭️  Skip: ${f}`);
      continue;
    }

    console.log(`🚀 Applying: ${f}`);
    await applyMigration(client, f, sql);
    console.log(`✅ Applied: ${f}`);
  }

  console.log("🎉 Done");
  await client.end();
}

main().catch((e) => {
  console.error("❌ Migration failed:", e?.message || e);
  process.exit(1);
});
