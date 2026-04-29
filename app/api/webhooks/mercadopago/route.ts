import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function verifySignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not set

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  const dataId = new URL(request.url).searchParams.get("data.id");

  if (!xSignature || !xRequestId) return false;

  const ts = xSignature.match(/ts=([^,]+)/)?.[1];
  const v1 = xSignature.match(/v1=([^,]+)/)?.[1];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifySignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);

  const paymentRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    }
  );

  if (!paymentRes.ok) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 200 });
  }

  const payment = await paymentRes.json();

  if (payment.status !== "approved" || !payment.external_reference) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", payment.external_reference)
    .single();

  if (profile?.is_pro) {
    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("profiles")
    .update({
      is_pro: true,
      pro_purchased_at: new Date().toISOString(),
      mp_payment_id: paymentId,
    })
    .eq("id", payment.external_reference);

  return NextResponse.json({ ok: true });
}
