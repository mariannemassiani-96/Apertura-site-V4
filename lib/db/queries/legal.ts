import { getPgPool } from "@/lib/db/postgres";

export async function getLatestLegalDocs() {
  const pool = getPgPool();
  const { rows } = await pool.query(
    `
    select distinct on (type) id, type
    from legal_documents
    order by type, published_at desc
    `
  );
  return rows as Array<{ id: string; type: string }>;
}

export async function hasAcceptedLatestCgvs(userId: string): Promise<boolean> {
  const pool = getPgPool();

  const docs = await getLatestLegalDocs();
  if (docs.length === 0) return true;

  const docIds = docs.map((d) => d.id);

  const { rows: accepted } = await pool.query(
    `
    select legal_document_id
    from legal_acceptances
    where user_id = $1
      and legal_document_id = any($2::uuid[])
    `,
    [userId, docIds]
  );

  return accepted.length === docIds.length;
}
