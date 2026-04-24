import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Workouts from "./pages/Workouts.tsx";
import WorkoutDetailPage from "./pages/WorkoutDetailPage.tsx";
import WorkoutStartPage from "./pages/WorkoutStartPage.tsx";
import Habits from "./pages/Habits.tsx";
import Stats from "./pages/Stats.tsx";
import Running from "./pages/Running.tsx";
import Auth from "./pages/Auth.tsx";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Protected><Index /></Protected>} />
            <Route path="/workouts" element={<Protected><Workouts /></Protected>} />
            <Route path="/workouts/:id" element={<Protected><WorkoutDetailPage /></Protected>} />
            <Route path="/workouts/:id/start" element={<Protected><WorkoutStartPage /></Protected>} />
            <Route path="/habits" element={<Protected><Habits /></Protected>} />
            <Route path="/running" element={<Protected><Running /></Protected>} />
            <Route path="/stats" element={<Protected><Stats /></Protected>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
