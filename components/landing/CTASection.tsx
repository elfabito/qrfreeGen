import { AnimateIn } from "@/components/ui/AnimateIn";

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Empezá a generar QR ahora.
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Sin registro, sin trampa. Si después necesitás más, ahí está el Pro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#generador"
                className="px-7 py-3.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-base shadow-lg shadow-accent/20"
              >
                Generar QR gratis
              </a>
              <a
                href="#precios"
                className="px-7 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors text-base"
              >
                Ver Pro
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
