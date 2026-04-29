import { AnimateIn } from "@/components/ui/AnimateIn";
import { Check, Pin, RefreshCw } from "lucide-react";

const STATIC_USES = [
  "Tu WiFi de casa",
  "Tu vCard personal",
  "Links permanentes",
  "Cualquier dato que no va a cambiar",
];

const DYNAMIC_USES = [
  "Menús de restaurante",
  "Flyers de eventos",
  "Tarjetas de presentación",
  "Packaging de productos",
  "Campañas con tracking",
];

export function StaticVsDynamic() {
  return (
    <section id="estatico-vs-dinamico" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Antes de imprimir, leé esto.
            </h2>
            <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
              La mayoría no sabe que existen dos tipos de QR. Y elegir mal puede costarte plata.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Static QR card */}
          <AnimateIn delay={100}>
            <div className="h-full bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-muted rounded-xl">
                  <Pin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">QR Estático</h3>
                  <p className="text-xs text-muted-foreground">El que acabás de generar</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                El link está dentro del QR mismo. Una vez impreso, el destino no se puede cambiar.
              </p>
              <div className="space-y-2.5 mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ideal para
                </p>
                {STATIC_USES.map((use) => (
                  <div key={use} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                    {use}
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                ✅ Gratis para siempre
              </div>
            </div>
          </AnimateIn>

          {/* Dynamic QR card */}
          <AnimateIn delay={200}>
            <div className="h-full bg-accent/5 border border-accent/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <RefreshCw className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">QR Dinámico</h3>
                  <p className="text-xs text-muted-foreground">El que viene en el Pro</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                El QR apunta a un link intermedio. Vos cambiás el destino real cuando quieras, sin
                reimprimir.
              </p>
              <div className="space-y-2.5 mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ideal para
                </p>
                {DYNAMIC_USES.map((use) => (
                  <div key={use} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {use}
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                💎 Incluido en Pro (USD 19 una vez)
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Analogy */}
        <AnimateIn delay={300}>
          <blockquote className="max-w-3xl mx-auto text-center border-t border-border pt-10">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              "El QR estático es como{" "}
              <strong className="text-foreground">tatuarte un número de teléfono</strong>. Si cambiás,
              te jodiste.
              <br className="hidden sm:block" />
              El QR dinámico es como{" "}
              <strong className="text-foreground">un asistente que reenvía las llamadas</strong>.
              Cambiás el destino cuando quieras y nadie se entera."
            </p>
          </blockquote>
        </AnimateIn>
      </div>
    </section>
  );
}
