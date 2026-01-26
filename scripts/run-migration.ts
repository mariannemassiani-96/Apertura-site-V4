import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPgPool } from "../lib/db/postgres";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: run-migration.ts <path-to-sql>");

  const sqlPath = resolve(process.cwd(), file);
  const sql = readFileSync(sqlPath, "utf8");

  const pool = getPgPool();
  // Exécute tout le SQL en une fois (OK pour une migration simple)
  await pool.query(sql);

  console.log("✅ Migration applied:", file);
}

main().catch((e) => {
  console.error("❌ Migration failed:", e);
  process.exit(1);
});
