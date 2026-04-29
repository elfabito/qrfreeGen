import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Panel — Mis QRs",
};

export default async function PanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: qrs } = await supabase
    .from("dynamic_qrs")
    .select("id, name, shortcode, destination_url, is_active, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Mis QRs dinámicos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {qrs?.length ?? 0} QR{(qrs?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/panel/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo QR
        </Link>
      </div>

      {!qrs || qrs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
            📱
          </div>
          <div>
            <p className="font-semibold text-foreground">Todavía no tenés QRs dinámicos</p>
            <p className="text-sm text-muted-foreground mt-1">
              Creá tu primer QR para empezar a trackear escaneos.
            </p>
          </div>
          <Link
            href="/panel/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Crear primer QR
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {qrs.map((qr, index) => (
            <div
              key={qr.id}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors ${
                index < qrs.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">
                    {qr.name ?? "Sin nombre"}
                  </span>
                  {qr.is_active ? (
                    <ToggleRight className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground font-mono">
                    /r/{qr.shortcode}
                  </span>
                  <span className="text-xs text-muted-foreground truncate hidden sm:block">
                    → {qr.destination_url}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${siteUrl}/r/${qr.shortcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Abrir link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  href={`/panel/qr/${qr.id}`}
                  className="px-3 py-1.5 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
