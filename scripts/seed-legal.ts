import { getPgPool } from "../lib/db/postgres";

async function main() {
  const pool = getPgPool();

  // CGV Portail
  await pool.query(
    `insert into legal_documents(type, version, url)
     values ('CGV_PORTAIL', 'v1-2026-01', '/legal/cgv-portail')
     on conflict do nothing`
  );

  // CGV Vente
  await pool.query(
    `insert into legal_documents(type, version, url)
     values ('CGV_VENTE', 'v1-2026-01', '/legal/cgv-vente')
     on conflict do nothing`
  );

  console.log("✅ CGV seeded");
}

main().catch((e) => {
  console.error("❌ CGV seed failed:", e);
  process.exit(1);
});