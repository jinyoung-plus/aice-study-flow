import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppUser = {
  id: string;
  nickname: string;
  is_admin: boolean;
  created_at: string;
};

type AuthCtx = {
  user: AppUser | null;
  loading: boolean;
  signup: (nickname: string, password: string) => Promise<{ error?: string }>;
  login: (nickname: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "aice.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const call = useCallback(async (action: "signup" | "login", nickname: string, password: string) => {
    const { data, error } = await supabase.functions.invoke("auth", {
      body: { action, nickname, password },
    });
    if (error) {
      // Try to extract server error message
      try {
        const ctx: any = (error as any).context;
        if (ctx && typeof ctx.json === "function") {
          const j = await ctx.json();
          if (j?.error) return { error: j.error as string };
        }
      } catch {}
      return { error: error.message };
    }
    if ((data as any)?.error) return { error: (data as any).error as string };
    const u = (data as any).user as AppUser;
    setUser(u);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch {}
    return {};
  }, []);

  const signup = useCallback((n: string, p: string) => call("signup", n, p), [call]);
  const login = useCallback((n: string, p: string) => call("login", n, p), [call]);
  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const value = useMemo(() => ({ user, loading, signup, login, logout }), [user, loading, signup, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
