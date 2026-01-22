import { NextResponse } from "next/server";
import { requireProSession } from "@/lib/pro/guard";
import { ALLOWED_FIELDS, ALLOWED_METHODS, ALLOWED_MODELS } from "@/lib/odoo/allowlist";
import { odooExecuteKw } from "@/lib/odoo/client";

export async function POST(req: Request) {
  const { session, response } = requireProSession();
  if (!session) return response!;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  const { model, method, args = [], kwargs = {} } = body as {
    model: string;
    method: string;
    args: any[];
    kwargs?: Record<string, any>;
  };

  if (!ALLOWED_MODELS.has(model)) return NextResponse.json({ error: "MODEL_NOT_ALLOWED" }, { status: 403 });
  if (!ALLOWED_METHODS.has(method)) return NextResponse.json({ error: "METHOD_NOT_ALLOWED" }, { status: 403 });

  // MVP : on force un contexte multi-sociétés sans encore imposer le choix explicite via UI.
  // Itération suivante : header obligatoire x-pro-company + validation SIAL/ISULA.
  const forcedCompany = session.allowedCompanies[0];
  kwargs.context = {
    ...(kwargs.context ?? {}),
    allowed_company_codes: session.allowedCompanies,
    forced_company_code: forcedCompany,
  };

  // champs allowlist : search_read uniquement
  if (method === "search_read") {
    const requestedFields = (kwargs.fields ?? []) as string[];
    const allowed = ALLOWED_FIELDS[model] ?? [];
    const safeFields = requestedFields.length ? requestedFields.filter((f) => allowed.includes(f)) : allowed;
    kwargs.fields = safeFields;
  }

  try {
    const result = await odooExecuteKw<any>({ model, method, args, kwargs });
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: "ODOO_ERROR", detail: e?.message ?? "unknown" }, { status: 500 });
  }
}
