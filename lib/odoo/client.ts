import { odooJsonRpc } from "./jsonrpc";

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

function assertEnv() {
  for (const k of ["ODOO_URL", "ODOO_DB", "ODOO_USERNAME", "ODOO_PASSWORD"]) {
    if (!process.env[k]) throw new Error(`Missing env ${k}`);
  }
}

/**
 * Auth API user (service: common/authenticate)
 * Returns UID
 */
export async function odooAuthenticate(): Promise<number> {
  assertEnv();

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "authenticate",
      args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
    },
    id: Date.now(),
  };

  const uid = await odooJsonRpc<number>(ODOO_URL, payload);
  if (!uid) throw new Error("ODOO_AUTH_FAILED");
  return uid;
}

/**
 * Execute KW (service: object/execute_kw)
 */
export async function odooExecuteKw<T>({
  model,
  method,
  args,
  kwargs,
}: {
  model: string;
  method: string;
  args: any[];
  kwargs?: Record<string, any>;
}): Promise<T> {
  const uid = await odooAuthenticate();

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs ?? {}],
    },
    id: Date.now(),
  };

  return odooJsonRpc<T>(ODOO_URL, payload);
}
