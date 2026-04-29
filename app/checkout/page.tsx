"use client";

import { useEffect, useState } from "react";
import { QrCode, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
      setError("El pago fue rechazado o cancelado. Podés intentarlo de nuevo.");
      return;
    }
    if (params.get("pending")) {
      setError("Tu pago está siendo procesado. Te avisaremos cuando se acredite.");
      return;
    }

    fetch("/api/checkout", { method: "POST" })
      .then((res) => {
        if (res.status === 409) {
          window.location.href = "/panel";
          return null;
        }
        if (res.status === 401) {
          window.location.href = "/login?redirect=/checkout";
          return null;
        }
        if (!res.ok) throw new Error("Error al iniciar el pago");
        return res.json();
      })
      .then((data) => {
        if (data?.init_point) {
          window.location.href = data.init_point;
        }
      })
      .catch(() => {
        setError("No se pudo iniciar el pago. Intentá de nuevo en unos segundos.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground mb-8">
            <QrCode className="w-5 h-5 text-accent" />
            <span>QR FreeGen</span>
          </Link>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <p className="text-foreground">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.search = "";
              }}
              className="w-full bg-accent text-accent-foreground rounded-xl py-2.5 font-medium hover:opacity-90 transition-opacity"
            >
              Intentar de nuevo
            </button>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
        <p className="text-muted-foreground text-sm">Redirigiendo a MercadoPago...</p>
      </div>
    </div>
  );
}
