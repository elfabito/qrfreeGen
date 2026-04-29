import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  if (profile?.is_pro) {
    return NextResponse.json({ error: "Already Pro" }, { status: 409 });
  }

  const preference = new Preference(mp);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const response = await preference.create({
    body: {
      items: [
        {
          id: "pro-lifetime",
          title: "QR FreeGen Pro — Pago único",
          quantity: 1,
          unit_price: 800,
          currency_id: "UYU",
        },
      ],
      external_reference: user.id,
      back_urls: {
        success: `${siteUrl}/gracias`,
        failure: `${siteUrl}/checkout?error=1`,
        pending: `${siteUrl}/checkout?pending=1`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    },
  });

  return NextResponse.json({ init_point: response.init_point });
}
