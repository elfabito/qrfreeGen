"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AnimateIn } from "@/components/ui/AnimateIn";

const FAQS = [
  {
    q: "¿Realmente es gratis para siempre?",
    a: "Sí. El tier gratis es 100% funcional y sin trampas. Para siempre. No hay límites ocultos ni features que se desbloquean después de un período de prueba.",
  },
  {
    q: "¿Qué pasa si quiero el Pro?",
    a: "Pagás USD 19 una vez con tarjeta vía Lemon Squeezy. Recibís un mail con magic link para acceder al panel. Listo, sos Pro de por vida.",
  },
  {
    q: "¿Puedo convertir un QR estático en dinámico después?",
    a: "No, son tecnologías distintas. Un QR estático tiene el destino codificado dentro. Para tener un QR dinámico hay que generar uno nuevo desde el panel Pro.",
  },
  {
    q: "¿Hay límite de escaneos en los QR dinámicos?",
    a: "Ninguno. Escaneos ilimitados, sin importar cuánto tráfico recibas.",
  },
  {
    q: "¿Y si el servicio cierra?",
    a: "Te avisamos con 6 meses de anticipación y te damos herramienta para exportar tus QR dinámicos a estáticos. Nunca quedás sin tus QR.",
  },
  {
    q: "¿Funciona offline?",
    a: "El generador gratis sí (es una PWA instalable). El Pro requiere internet porque los QR dinámicos pasan por nuestro servidor para el redirect.",
  },
  {
    q: "¿Puedo usar los QR generados para fines comerciales?",
    a: "Sí, son tuyos. Hacé lo que quieras con ellos. No hay restricciones de uso.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-foreground text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Preguntas frecuentes.
            </h2>
          </div>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="max-w-2xl bg-card border border-border rounded-2xl px-8">
            {FAQS.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
