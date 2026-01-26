import { getPgPool } from "@/lib/db/postgres";

export async function getLatestClientSnapshot(args: {
  companyId: string;
  odooCompanyCode: "SIAL" | "ISULA";
}) {
  const pool = getPgPool();
  const { rows } = await pool.query(
    `
    SELECT *
    FROM odoo_snapshots
    WHERE company_id = $1
      AND odoo_company_code = $2
      AND scope = 'ODDO_POLL_CLIENT'
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [args.companyId, args.odooCompanyCode]
  );

  return rows[0] ?? null;
}
