import { getPgPool } from "@/lib/db/postgres";

/**
 * Snapshot client (utilisé par le dashboard PRO)
 * Scope : ODDO_POLL_CLIENT
 */
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

/**
 * DEV ONLY
 * Snapshot seed pour alimenter le dashboard sans Odoo
 * Scope isolé pour ne pas polluer les snapshots réels
 */
export async function insertDashboardSnapshot(args: {
  companyId: string;
  odooCompanyCode: "SIAL" | "ISULA";
  payload: any;
  payloadHash: string;
}) {
  const pool = getPgPool();
  const scope = "DASHBOARD_SEED";

  const { rows } = await pool.query(
    `
    INSERT INTO odoo_snapshots (
      company_id,
      odoo_company_code,
      scope,
      payload,
      payload_hash,
      created_at
    )
    VALUES ($1, $2, $3, $4::jsonb, $5, NOW())
    ON CONFLICT (company_id, odoo_company_code, scope, payload_hash)
    DO NOTHING
    RETURNING id, created_at
    `,
    [
      args.companyId,
      args.odooCompanyCode,
      scope,
      JSON.stringify(args.payload),
      args.payloadHash,
    ]
  );

  return rows[0] ?? null;
}
