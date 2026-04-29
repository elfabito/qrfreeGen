import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EditQRForm } from "@/components/panel/EditQRForm";

export const metadata: Metadata = {
  title: "Editar QR",
};

export default async function EditQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: qr } = await supabase
    .from("dynamic_qrs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!qr) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/panel"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al panel
        </Link>
        <h1 className="text-xl font-bold text-foreground">
          {qr.name ?? "QR sin nombre"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono">
          /r/{qr.shortcode}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <EditQRForm qr={qr} />
      </div>
    </div>
  );
}
