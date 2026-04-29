"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single<{ is_pro: boolean }>();
      setIsPro(data?.is_pro ?? false);
      setIsLoading(false);
    }
    check();
  }, []);

  return { isPro, isLoading };
}
