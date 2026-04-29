"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { QrCode, Sun, Moon, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Generador", href: "#generador" },
  { label: "Pro", href: "#precios" },
  { label: "Privacidad", href: "#privacidad" },
  { label: "Sobre", href: "/sobre" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setUserLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <QrCode className="w-5 h-5 text-accent" />
          <span>QR FreeGen</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cambiar tema"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
            ) : (
              <span className="w-4 h-4 block" />
            )}
          </button>

          {/* Auth: desktop */}
          {!userLoading && (
            user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/panel"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mi panel
                </Link>
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Iniciar sesión
              </Link>
            )
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden transition-all duration-200",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Auth: mobile */}
          {!userLoading && (
            user ? (
              <>
                <Link
                  href="/panel"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi panel
                </Link>
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
