import { redirect } from "next/navigation";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  if (!profile?.is_pro) {
    redirect("/#precios");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <QrCode className="w-4 h-4 text-accent" />
              <span className="text-sm">QR Local</span>
            </Link>
            <Link
              href="/panel"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mis QRs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
