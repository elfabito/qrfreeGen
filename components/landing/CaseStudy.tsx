import { AnimateIn } from "@/components/ui/AnimateIn";

export function CaseStudy() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Un ejemplo concreto.</h2>
          </div>
        </AnimateIn>

        <AnimateIn delay={150}>
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 max-w-4xl">
            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                <strong className="text-foreground">Imaginate:</strong> Tenés un restaurante. Mandás
                a imprimir 30 QR para los menús de las mesas.
              </p>
              <p className="text-2xl font-bold text-foreground">Costo de impresión: USD 50.</p>
              <p>
                Tres semanas después, sube el precio del aceite y tenés que actualizar 12 platos.
              </p>
            </div>

            {/* Before / After comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-muted/50 border border-border rounded-xl p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Con QR estático
                </p>
                <p className="text-3xl font-bold text-foreground mb-1">USD 150+</p>
                <p className="text-sm text-muted-foreground">
                  Reimprimís los 30 menús cada vez que hay un cambio. USD 50 ahora, USD 50 la
                  próxima vez, USD 50 la siguiente.
                </p>
              </div>
              <div className="bg-accent/5 border border-accent/30 rounded-xl p-6">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  Con QR dinámico (Pro)
                </p>
                <p className="text-3xl font-bold text-foreground mb-1">USD 0</p>
                <p className="text-sm text-muted-foreground">
                  Abrís el panel, cambiás el PDF del menú, y los 30 QR ya impresos siguen funcionando
                  con la nueva info.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-lg font-bold text-foreground">
                El Pro se paga solo en el primer cambio.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                USD 19 una vez vs USD 50 cada vez que actualizás el menú.
              </p>
              <a
                href="#precios"
                className="inline-flex items-center mt-4 px-5 py-2.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm shadow-accent/20"
              >
                Ver plan Pro →
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
