import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ScrollReset } from "@/components/ui/ScrollReset";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QR FreeGen — Generador de QR 100% local y privado",
    template: "%s | QR FreeGen",
  },
  description:
    "Generá códigos QR gratis, sin límites y sin que tus datos salgan de tu navegador. 100% local. Sin tracking. Sin registro.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QR FreeGen",
  },
  openGraph: {
    title: "QR FreeGen",
    description: "Generador de QR 100% local y privado. Gratis para siempre.",
    url: "https://qr.desane.com.uy",
    siteName: "QR FreeGen",
    locale: "es_UY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <ScrollReset />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
