import type { Metadata } from "next";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <QrCode className="w-5 h-5 text-accent" />
            <span>QR Local</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-6">Bienvenido de vuelta</h1>
          <p className="text-sm text-muted-foreground mt-1">Ingresá a tu cuenta</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
