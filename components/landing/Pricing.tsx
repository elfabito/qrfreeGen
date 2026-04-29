import { AnimateIn } from "@/components/ui/AnimateIn";
import { Check } from "lucide-react";

const FREE_FEATURES = [
  "QR estáticos ilimitados",
  "Todos los tipos (URL, WiFi, vCard, etc.)",
  "Personalización visual completa",
  "Descarga PNG y SVG",
  "100% local en tu navegador",
  "Sin registro",
];

const PRO_FEATURES = [
  { text: "Todo lo del plan Gratis", highlight: false },
  { text: "QR dinámicos editables", highlight: true },
  { text: "Estadísticas de escaneos", highlight: true },
  { text: "Branding avanzado con logo grande", highlight: true },
  { text: "Generación masiva desde CSV", highlight: true },
  { text: "Carpetas para organizar", highlight: true },
  { text: "Soporte directo por email", highlight: false },
];

export function Pricing() {
  return (
    <section id="precios" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Elegí el plan que necesitás.
            </h2>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* Free */}
          <AnimateIn delay={100}>
            <div className="h-full bg-card border border-border rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">Gratis</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">$0</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Para siempre</p>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>

              <a
                href="#generador"
                className="block text-center px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors text-sm"
              >
                Empezar gratis
              </a>
            </div>
          </AnimateIn>

          {/* Pro */}
          <AnimateIn delay={200}>
            <div className="h-full bg-accent/5 border border-accent/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-bl-xl">
                💎 Más popular
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-accent mb-2">Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-muted-foreground">USD</span>
                  <span className="text-5xl font-bold text-foreground">19</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Pago único, sin suscripción. Para siempre.</p>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                {PRO_FEATURES.map(({ text, highlight }) => (
                  <div key={text} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${highlight ? "text-accent" : "text-muted-foreground"}`}
                    />
                    <span className={highlight ? "text-foreground font-medium" : "text-foreground"}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="/checkout"
                className="block text-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-md shadow-accent/25"
              >
                Comprar Pro
              </a>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
