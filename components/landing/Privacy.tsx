import { AnimateIn } from "@/components/ui/AnimateIn";
import { ExternalLink } from "lucide-react";

const STEPS = [
  "Abrí las herramientas de desarrollo (F12 o clic derecho → Inspeccionar).",
  'Andá a la pestaña "Network" o "Red".',
  "Generá un QR.",
  "Vas a ver: cero requests salientes con tus datos.",
];

export function Privacy() {
  return (
    <section id="privacidad" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              ¿Cómo sabés que es realmente local?
            </h2>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <AnimateIn delay={100}>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Otros generadores dicen "tu privacidad es importante" mientras suben tus datos a su
                servidor. Acá es distinto:
              </p>

              <ol className="space-y-4 mt-6">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground pt-0.5 leading-relaxed">
                      {i === 3 ? (
                        <>
                          Vas a ver:{" "}
                          <strong className="text-accent">
                            cero requests salientes con tus datos
                          </strong>
                          .
                        </>
                      ) : (
                        step
                      )}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 text-sm">
                El código del generador corre 100% en tu navegador. Es la única forma honesta de
                prometer privacidad.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="bg-muted/50 border border-border rounded-2xl p-8 space-y-4">
              <p className="text-sm font-semibold text-foreground">¿Por qué importa?</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si generás el QR con tu contraseña de WiFi, tu dirección, o tus datos de contacto, esa
                información nunca debería salir de tu computadora.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Con un generador basado en servidor, esos datos viajan a una empresa que vos no
                controlás. Nosotros preferimos que el código corra donde están tus datos: en tu
                máquina.
              </p>
              <a
                href="https://github.com/elfabito/qrfreeGen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ver código en GitHub
              </a>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
