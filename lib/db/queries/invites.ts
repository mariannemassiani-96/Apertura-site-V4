import { getPgPool } from "@/lib/db/postgres";

/**
 * Crée un token (hashé) dans password_resets
 * Utilisé pour invitation + reset password (MVP)
 */
export async function createPasswordResetToken(params: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  const pool = getPgPool();

  await pool.query(
    `
    insert into password_resets(user_id, token_hash, expires_at)
    values ($1, $2, $3)
    `,
    [params.userId, params.tokenHash, params.expiresAt]
  );
}

/**
 * Consomme (usage unique) un token hashé.
 * Retourne le userId si valide.
 */
export async function consumePasswordResetToken(params: { tokenHash: string }) {
  const pool = getPgPool();

  const { rows } = await pool.query(
    `
    select id, user_id, expires_at, used_at
    from password_resets
    where token_hash = $1
    limit 1
    `,
    [params.tokenHash]
  );

  const rec = rows[0];
  if (!rec) return { ok: false as const, reason: "not_found" as const };
  if (rec.used_at) return { ok: false as const, reason: "used" as const };

  const exp = new Date(rec.expires_at).getTime();
  if (Number.isFinite(exp) && exp < Date.now()) {
    return { ok: false as const, reason: "expired" as const };
  }

  await pool.query(
    `
    update password_resets
    set used_at = now()
    where id = $1
    `,
    [rec.id]
  );

  return { ok: true as const, userId: rec.user_id as string };
}

/**
 * Définit le password_hash d’un utilisateur.
 */
export async function setUserPasswordHash(params: {
  userId: string;
  passwordHash: string;
}) {
  const pool = getPgPool();

  await pool.query(
    `
    update portal_users
    set password_hash = $2
    where id = $1
    `,
    [params.userId, params.passwordHash]
  );
}
