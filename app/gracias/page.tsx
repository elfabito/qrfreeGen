import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PendingState from "./pending";

export const metadata: Metadata = {
  title: "¡Gracias por tu compra!",
};

export default async function GraciasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  const isPro = profile?.is_pro ?? false;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground mb-8">
          <QrCode className="w-5 h-5 text-accent" />
          <span>QR FreeGen</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          {isPro ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">¡Ya sos Pro!</h1>
                <p className="text-muted-foreground text-sm">
                  Tu pago fue acreditado. Ahora tenés acceso a todos los QR dinámicos, estadísticas y más.
                </p>
              </div>
              <Link
                href="/panel"
                className="block w-full bg-accent text-accent-foreground rounded-xl py-2.5 font-medium hover:opacity-90 transition-opacity"
              >
                Ir al panel
              </Link>
            </>
          ) : (
            <PendingState />
          )}
        </div>
      </div>
    </div>
  );
}
