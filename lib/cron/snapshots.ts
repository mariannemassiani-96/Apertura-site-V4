import crypto from "crypto";
import { getPgPool } from "@/lib/db/postgres";

export async function getSnapshot(entityType: string, odooId: number) {
  const pool = getPgPool();
  const res = await pool.query(
    `select entity_type, odoo_id, hash, payload, created_at
     from status_snapshots
     where entity_type=$1 and odoo_id=$2`,
    [entityType, odooId]
  );
  return res.rows[0] ?? null;
}

export function hashPayload(payload: any) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

export async function upsertSnapshot(entityType: string, odooId: number, payload: any) {
  const hash = hashPayload(payload);

  const pool = getPgPool();
  await pool.query(
    `
    insert into status_snapshots(entity_type, odoo_id, hash, payload)
    values($1,$2,$3,$4)
    on conflict (entity_type, odoo_id)
    do update set hash=$3, payload=$4, created_at=now()
    `,
    [entityType, odooId, hash, payload]
  );

  return hash;
}

export async function hasNotificationBeenSent(dedupeKey: string) {
  const pool = getPgPool();
  const res = await pool.query(
    `select 1 from notification_log where dedupe_key=$1 limit 1`,
    [dedupeKey]
  );
  return res.rowCount > 0;
}

export async function logNotification(params: {
  entityType: string;
  odooId: number;
  eventType: string;
  toEmail: string;
  dedupeKey: string;
  providerMessageId?: string;
}) {
  const pool = getPgPool();

  await pool.query(
    `
    insert into notification_log
      (entity_type, odoo_id, event_type, to_email, dedupe_key, provider_message_id)
    values ($1,$2,$3,$4,$5,$6)
    on conflict (dedupe_key) do nothing
    `,
    [
      params.entityType,
      params.odooId,
      params.eventType,
      params.toEmail,
      params.dedupeKey,
      params.providerMessageId ?? null,
    ]
  );
}
