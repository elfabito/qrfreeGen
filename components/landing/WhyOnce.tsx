import { AnimateIn } from "@/components/ui/AnimateIn";
import { DollarSign, RefreshCw, LogOut } from "lucide-react";

const REASONS = [
  {
    icon: DollarSign,
    title: "Pagás una vez",
    description: "USD 19 y listo, sin renovaciones automáticas.",
  },
  {
    icon: RefreshCw,
    title: "Updates incluidos",
    description: "Nuevas features Pro, sin costo extra.",
  },
  {
    icon: LogOut,
    title: "Sin lock-in",
    description:
      "Si cerramos el servicio (no planeamos), te avisamos con 6 meses y exportás tus QR.",
  },
];

export function WhyOnce() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Odiamos las suscripciones tanto como vos.
            </h2>
          </div>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="max-w-2xl mb-12 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Las herramientas chicas no deberían cobrarte todos los meses para siempre. Si está
              buena, la pagás una vez y listo. Punto.
            </p>
            <p>
              Tu compra de Pro te da acceso de por vida a todas las features actuales y a las nuevas
              que vayamos agregando.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {REASONS.map(({ icon: Icon, title, description }, i) => (
            <AnimateIn key={title} delay={i * 100}>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-accent/10 rounded-xl w-fit">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
