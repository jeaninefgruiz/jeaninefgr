import { NavLink } from "react-router-dom";
import { Calendar, Dumbbell, BarChart3, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Today", icon: Calendar },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/habits", label: "Habits", icon: Droplet },
  { to: "/stats", label: "Stats", icon: BarChart3 },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-medium transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                    isActive && "bg-primary-soft text-primary scale-110"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
