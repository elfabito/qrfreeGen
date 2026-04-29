import { Generator } from "@/components/generator/Generator";

export function GeneratorSection() {
  return (
    <section id="generador" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Generá tu QR</h2>
          <p className="mt-2 text-muted-foreground">
            100% en tu navegador. Nadie ve tus datos.
          </p>
        </div>
        <Generator />
      </div>
    </section>
  );
}
