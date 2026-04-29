import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NuevoQRPanel } from "@/components/panel/NuevoQRPanel";

export const metadata: Metadata = {
  title: "Nuevo QR",
};

export default function NuevoQRPage() {
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
        <h1 className="text-xl font-bold text-foreground">Nuevo QR</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <NuevoQRPanel />
      </div>
    </div>
  );
}
