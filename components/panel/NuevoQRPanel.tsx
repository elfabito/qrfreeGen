"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { NuevoQRForm } from "./NuevoQRForm";
import { Generator } from "@/components/generator/Generator";

type Mode = "dinamico" | "estatico";

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function NuevoQRPanel() {
  const [mode, setMode] = useState<Mode>("dinamico");

  return (
    <div>
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 max-w-xs">
        <TabBtn active={mode === "dinamico"} onClick={() => setMode("dinamico")}>
          QR Dinámico
        </TabBtn>
        <TabBtn active={mode === "estatico"} onClick={() => setMode("estatico")}>
          QR Estático
        </TabBtn>
      </div>

      {mode === "dinamico" ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            El código QR apuntará a un enlace que podés cambiar cuando quieras. Incluye estadísticas de escaneo.
          </p>
          <NuevoQRForm />
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            Generá un QR con todos los tipos (URL, WiFi, vCard…), colores, estilos y logo. Se crea en tu navegador y lo descargás.
          </p>
          <Generator />
        </>
      )}
    </div>
  );
}
