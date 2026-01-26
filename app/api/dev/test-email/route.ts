import { NextResponse } from "next/server";
import { dispatchEmail } from "@/lib/notify/dispatch";

export async function GET(req: Request) {
  // Never allow this endpoint in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // Optional extra safety in dev
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const expected = process.env.DEV_TEST_TOKEN;

  if (expected && token !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const to = process.env.TEST_EMAIL_TO;
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing env TEST_EMAIL_TO" },
        { status: 400 }
      );
    }

    const res = await dispatchEmail({
      event: "SIGNATURE_REQUIRED",
      to: [{ email: to }],
      ctx: { orderName: "CMD-TEST", portalUrl: "https://example.com/pro" },
    });

    return NextResponse.json({ ok: true, res });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}

