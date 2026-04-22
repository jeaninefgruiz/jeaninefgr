import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.07-1.1-.16-1.6H12z"/>
    <path fill="#34A853" d="M3.6 7.4l3.2 2.4C7.7 7.7 9.7 6.4 12 6.4c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 8.3 2.5 5.1 4.6 3.6 7.4z" opacity="0"/>
    <path fill="#4A90E2" d="M0 0h24v24H0z" opacity="0"/>
  </svg>
);

export default function Auth() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao entrar";
      toast.error(msg);
    }
  };

  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Bem-vinda de volta</h1>
          <p className="text-sm text-muted-foreground">
            Entre para sincronizar seus treinos e hábitos em todos os dispositivos.
          </p>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-card space-y-3">
          <Button
            onClick={handleGoogle}
            variant="outline"
            className="w-full h-12 rounded-2xl text-base font-semibold gap-3"
          >
            <GoogleIcon />
            Entre com Google
          </Button>
          <p className="text-xs text-muted-foreground">
            Ao continuar, você concorda em sincronizar seu progresso na sua conta.
          </p>
        </div>
      </div>
    </main>
  );
}
