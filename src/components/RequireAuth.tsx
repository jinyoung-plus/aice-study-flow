import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./AuthContext";

export function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
    } else if (adminOnly && !user.is_admin) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, adminOnly, navigate]);

  if (loading || !user || (adminOnly && !user.is_admin)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        불러오는 중…
      </div>
    );
  }
  return <>{children}</>;
}
