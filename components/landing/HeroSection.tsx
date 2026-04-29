import { HeroQRPreview } from "./HeroQRPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Generá QR sin que tus datos salgan de tu navegador.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Gratis, sin registro, sin tracking. Para siempre. Y si necesitás más, hay un Pro honesto.
            </p>

            {/* Trust badge */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-1.5 px-4 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm">
              <span>🔒</span>
              <span className="font-medium">100% local — verificable abriendo DevTools</span>
              <a href="#privacidad" className="underline underline-offset-2 opacity-80 hover:opacity-100">
                ¿Cómo lo verifico?
              </a>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#generador"
                className="px-7 py-3.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-base shadow-lg shadow-accent/20"
              >
                Generar mi QR
              </a>
              <a
                href="#precios"
                className="px-7 py-3.5 bg-transparent border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors text-base"
              >
                Ver plan Pro
              </a>
            </div>
          </div>

          {/* Right: animated QR preview */}
          <div className="flex justify-center lg:justify-end">
            <HeroQRPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
