"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type DynamicQR = Database["public"]["Tables"]["dynamic_qrs"]["Row"];

export function EditQRForm({ qr }: { qr: DynamicQR }) {
  const [name, setName] = useState(qr.name ?? "");
  const [destinationUrl, setDestinationUrl] = useState(qr.destination_url);
  const [isActive, setIsActive] = useState(qr.is_active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [scanCount, setScanCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const qrUrl = `${siteUrl}/r/${qr.shortcode}`;

  useEffect(() => {
    if (!qrRef.current) return;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: qrUrl,
        dotsOptions: { color: "#000000", type: "square" },
        backgroundOptions: { color: "#ffffff" },
        qrOptions: { errorCorrectionLevel: "M" },
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qrCode.append(qrRef.current);
      }
    });
  }, [qrUrl]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("qr_id", qr.id)
      .then(({ count }) => setScanCount(count ?? 0));
  }, [qr.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    try {
      new URL(destinationUrl);
    } catch {
      setError("Ingresá una URL válida.");
      return;
    }

    setSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("dynamic_qrs")
      .update({
        name: name.trim() || null,
        destination_url: destinationUrl,
        is_active: isActive,
      })
      .eq("id", qr.id);

    setSaving(false);

    if (updateError) {
      setError("No se pudo guardar. Intentá de nuevo.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleToggleActive() {
    const newActive = !isActive;
    setIsActive(newActive);

    const supabase = createClient();
    await supabase
      .from("dynamic_qrs")
      .update({ is_active: newActive })
      .eq("id", qr.id);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: QR preview + info */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex justify-center">
          <div ref={qrRef} />
        </div>

        {/* Scan count */}
        <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-foreground">
            {scanCount === null ? "—" : scanCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">escaneos totales</p>
        </div>

        {/* Shortcode link */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">Tu enlace dinámico</p>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <span className="flex-1 text-xs font-mono text-muted-foreground truncate">
              {qrUrl}
            </span>
            <button
              onClick={copyLink}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Copiar"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">QR activo</p>
            <p className="text-xs text-muted-foreground">
              {isActive ? "Los escaneos redirigen normalmente" : "El QR no redirige"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleActive}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
              isActive ? "bg-accent" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                isActive ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Right: Edit form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-name" className="text-sm font-medium text-foreground">
              Nombre{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Link bio Instagram"
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-url" className="text-sm font-medium text-foreground">
              URL de destino
            </label>
            <input
              id="edit-url"
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://tusitio.com/pagina"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <p className="text-xs text-muted-foreground">
              Todos los escaneos futuros irán a esta URL. El código QR no cambia.
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && (
            <p className="text-sm text-accent font-medium">✓ Cambios guardados</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="self-start px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
