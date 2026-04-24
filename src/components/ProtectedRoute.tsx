import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { migrateLocalToCloud } from "@/lib/cloudStorage";
import { isEmailAllowed } from "@/lib/accessControl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
    if (user) {
      if (!isEmailAllowed(user.email)) {
        toast.error("Acesso negado: este e-mail não está autorizado.");
        supabase.auth.signOut().finally(() => navigate("/auth", { replace: true }));
        return;
      }
      migrateLocalToCloud(user.id);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  if (!isEmailAllowed(user.email)) return null;
  return <>{children}</>;
};
