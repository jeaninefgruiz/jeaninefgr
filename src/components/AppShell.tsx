import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen gradient-hero">
      <main className="mx-auto max-w-md px-4 pb-28 pt-6">
        {user && (
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-7 gap-1 rounded-full px-2 text-xs"
              aria-label="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </Button>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
