"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PendingState() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <>
      <Clock className="w-12 h-12 text-accent mx-auto animate-pulse" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">¡Gracias por tu compra!</h1>
        <p className="text-muted-foreground text-sm">
          Tu pago está siendo procesado. En unos segundos tendrás acceso Pro.
          Podés refrescar esta página o ir al panel.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href="/panel"
          className="block w-full bg-accent text-accent-foreground rounded-xl py-2.5 font-medium hover:opacity-90 transition-opacity"
        >
          Ir al panel
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
