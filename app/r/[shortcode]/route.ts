import { type NextRequest, NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getDeviceType(ua: string): string {
  if (/mobile/i.test(ua) && !/tablet|ipad/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function getBrowserName(ua: string): string | null {
  if (/edg\//i.test(ua)) return "Edge";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/opr\//i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua)) return "Safari";
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const supabase = await createClient();

  const { data: qr } = await supabase
    .from("dynamic_qrs")
    .select("id, destination_url")
    .eq("shortcode", shortcode)
    .eq("is_active", true)
    .single();

  if (!qr) {
    return new NextResponse("QR no encontrado", { status: 404 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  const device = getDeviceType(ua);
  const browser = getBrowserName(ua);

  const country =
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    null;

  after(async () => {
    const supabaseAfter = await createClient();
    await supabaseAfter.from("scans").insert({
      qr_id: qr.id,
      country,
      device_type: device,
      browser,
    });
  });

  return NextResponse.redirect(qr.destination_url, { status: 302 });
}
