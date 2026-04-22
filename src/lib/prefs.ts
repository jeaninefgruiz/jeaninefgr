// User preferences sync helpers — writes/reads pass through cloudStorage when authenticated.
import { supabase } from "@/integrations/supabase/client";
import { todayKey } from "./storage";

export type WorkoutTime = "06:00" | "18:00";

// Insert or move a "Gym session" task to the chosen time on today's planner (cloud).
export const syncGymTaskToToday = async (userId: string, time: WorkoutTime) => {
  const day = todayKey();
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("id,time,title,done")
    .eq("user_id", userId)
    .eq("day", day);
  if (error) throw error;

  const existing = (data ?? []).find((t) => {
    const title = t.title.toLowerCase();
    return title.includes("treino") || title.includes("academia") || title.includes("gym");
  });

  if (existing) {
    await supabase.from("planner_tasks").update({ time, updated_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    await supabase.from("planner_tasks").insert({
      user_id: userId, day, time, title: "Treino na academia", done: false,
    });
  }
};
