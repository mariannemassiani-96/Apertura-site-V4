import { getPgPool } from "@/lib/db/postgres";

function pad6(n: number) {
  return String(n).padStart(6, "0");
}

export async function generatePortalRef(args: { societeCode: "SIAL" | "ISULA" }) {
  const pool = getPgPool();
  const year = new Date().getFullYear();
  const prefix = args.societeCode === "SIAL" ? "S" : "I";

  // ✅ clé technique unique en DB
  const seqKey = `${args.societeCode}-${year}`;

  const { rows } = await pool.query(
    `
    INSERT INTO portal_sequences (seq_key, societe_code, year, last_value)
    VALUES ($1, $2, $3, 1)
    ON CONFLICT (seq_key)
    DO UPDATE SET
      last_value = portal_sequences.last_value + 1,
      updated_at = now()
    RETURNING last_value
    `,
    [seqKey, args.societeCode, year]
  );

  const n = rows[0]?.last_value as number;
  return `${prefix}-${year}-${pad6(n)}`;
}
