"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateShortcode } from "@/lib/utils/shortcode";

interface CreatedQR {
  id: string;
  shortcode: string;
}

export function NuevoQRForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreatedQR | null>(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "";

  useEffect(() => {
    if (!created || !qrRef.current) return;

    const qrUrl = `${siteUrl}/r/${created.shortcode}`;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: qrUrl,
        dotsOptions: { color: "#000000", type: "square" },
        backgroundOptions: { color: "#ffffff" },
        qrOptions: { errorCorrectionLevel: "M" },
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qr.append(qrRef.current);
      }
    });
  }, [created, siteUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      new URL(destinationUrl);
    } catch {
      setError("Ingresá una URL válida (ej: https://ejemplo.com).");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Retry up to 3 times on shortcode collision
    for (let attempt = 0; attempt < 3; attempt++) {
      const shortcode = generateShortcode();

      const { data, error: insertError } = await supabase
        .from("dynamic_qrs")
        .insert({
          user_id: user.id,
          shortcode,
          destination_url: destinationUrl,
          name: name.trim() || null,
        })
        .select("id, shortcode")
        .single();

      if (!insertError) {
        setCreated(data);
        setLoading(false);
        return;
      }

      // 23505 = unique_violation (shortcode collision), retry
      if (insertError.code !== "23505") {
        setError("No se pudo guardar el QR. Intentá de nuevo.");
        setLoading(false);
        return;
      }
    }

    setError("Ocurrió un error generando el código. Intentá de nuevo.");
    setLoading(false);
  }

  async function copyLink() {
    if (!created) return;
    await navigator.clipboard.writeText(`${siteUrl}/r/${created.shortcode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (created) {
    const qrUrl = `${siteUrl}/r/${created.shortcode}`;
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <div ref={qrRef} />
        </div>

        <div className="w-full max-w-sm text-center">
          <p className="text-sm font-medium text-foreground mb-1">Tu enlace dinámico</p>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
            <span className="flex-1 text-sm font-mono text-muted-foreground truncate">
              {qrUrl}
            </span>
            <button
              onClick={copyLink}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Copiar"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/panel/qr/${created.id}`}
            className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Ver y editar QR
          </Link>
          <Link
            href="/panel"
            className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors"
          >
            Ir al panel
          </Link>
        </div>

        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Probar redirect
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nombre{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej: Link bio Instagram"
          maxLength={80}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="destination" className="text-sm font-medium text-foreground">
          URL de destino
        </label>
        <input
          id="destination"
          type="url"
          required
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          placeholder="https://tusitio.com/pagina"
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <p className="text-xs text-muted-foreground">
          Podés cambiar esta URL cuando quieras sin reimprimir el QR.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generando…" : "Generar QR dinámico"}
      </button>
    </form>
  );
}
