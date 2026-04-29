import Link from "next/link";
import { QrCode } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Generador", href: "#generador" },
  { label: "Pro", href: "#precios" },
  { label: "Privacidad", href: "#privacidad" },
  { label: "Sobre", href: "/sobre" },
];

const RESOURCE_LINKS = [
  { label: "GitHub", href: "https://github.com/elfabito/qrfreeGen", external: true },
  { label: "Soporte", href: "mailto:info@desane.com.uy", external: false },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <QrCode className="w-5 h-5 text-accent" />
              <span>QR FreeGen</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              QR FreeGen es una herramienta de{" "}
              <a
                href="https://desane.com.uy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-accent transition-colors"
              >
                Desane
              </a>
              , un estudio freelance de Uruguay 🇺🇾
            </p>
          </div>

          {/* Producto */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Producto
            </p>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Recursos
            </p>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Desane. Hecho con cariño en Maldonado.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Política de privacidad
            </a>
            <a href="/terminos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
