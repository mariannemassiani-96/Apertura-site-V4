import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

const SIAL_NAME = process.env.ODOO_COMPANY_SIAL_NAME!;
const ISULA_NAME = process.env.ODOO_COMPANY_ISULA_NAME!;

// ---- JSON-RPC core
async function odooCall<T>(params: any): Promise<T> {
  const url = `${ODOO_URL}/jsonrpc`;

  try {
    console.log("[odoo] calling", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params,
        id: crypto.randomUUID(),
      }),
    });

    const text = await res.text().catch(() => "");
    console.log("[odoo] status", res.status);
    console.log("[odoo] body(first 300)", text.slice(0, 300));

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response (HTTP ${res.status})`);
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (json.error) throw new Error(`JSON-RPC error: ${JSON.stringify(json.error)}`);

    return json.result as T;
  } catch (e: any) {
    // ici on récupère généralement la vraie cause undici/node
    console.error("[odoo] fetch failed:", e?.message);
    console.error("[odoo] cause:", e?.cause);
    console.error("[odoo] code:", e?.code);
    throw e;
  }
}

async function login(): Promise<number> {
  const uid = await odooCall<number>({
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  });
  if (!uid) throw new Error("Auth failed");
  return uid;
}

async function executeKw<T>(
  uid: number,
  model: string,
  method: string,
  args: any[],
  kwargs: any = {}
): Promise<T> {
  return odooCall<T>({
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

export async function GET() {
  // ✅ Never allow this endpoint in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // Logs utiles (DEV uniquement)
  console.log("[odoo-introspect] start", new Date().toISOString());
  console.log("[odoo-introspect] ODOO_URL =", process.env.ODOO_URL);
  console.log("[odoo-introspect] ODOO_DB =", process.env.ODOO_DB);
  console.log("[odoo-introspect] ODOO_USERNAME =", process.env.ODOO_USERNAME);
  console.log("[odoo-introspect] has password =", Boolean(process.env.ODOO_PASSWORD));

  try {
    const uid = await login();

    // 1) Find companies by name
    const findCompany = async (name: string) => {
      const ids = await executeKw<number[]>(
        uid,
        "res.company",
        "search",
        [[["name", "=", name]]],
        { limit: 5 }
      );
      const recs = await executeKw<any[]>(
        uid,
        "res.company",
        "read",
        [ids, ["id", "name"]]
      );
      return recs;
    };

    const sialCompanies = await findCompany(SIAL_NAME);
    const isulaCompanies = await findCompany(ISULA_NAME);

    // 2) Introspect sale.order fields
    const fields = await executeKw<any>(
      uid,
      "sale.order",
      "fields_get",
      [[]],
      { attributes: ["string", "type", "relation", "selection", "required"] }
    );

    // Optionnel: réduire pour ne pas renvoyer 3000 lignes
    const interesting = Object.fromEntries(
      Object.entries(fields).filter(([k]) =>
        k.startsWith("x_") ||
        ["state", "company_id", "partner_id", "write_date", "date_order"].includes(k)
      )
    );

    return NextResponse.json({
      ok: true,
      companies: { sialCompanies, isulaCompanies },
      saleOrderFieldsInteresting: interesting,
      tips: [
        "Cherche un champ x_* qui ressemble à stage/pipeline/statut devis",
        "Cherche un champ x_* qui ressemble à type_commande / order_type",
      ],
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "error" },
      { status: 500 }
    );
  }
}
