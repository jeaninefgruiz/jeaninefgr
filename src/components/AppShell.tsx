import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen gradient-hero">
      <main className="mx-auto max-w-md px-4 pb-28 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
};
