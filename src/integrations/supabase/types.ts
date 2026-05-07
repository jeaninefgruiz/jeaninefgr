export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      habits_daily: {
        Row: {
          day: string
          id: string
          skincare_night: number
          sleep: number
          steps: number
          updated_at: string
          user_id: string
          water: number
        }
        Insert: {
          day: string
          id?: string
          skincare_night?: number
          sleep?: number
          steps?: number
          updated_at?: string
          user_id: string
          water?: number
        }
        Update: {
          day?: string
          id?: string
          skincare_night?: number
          sleep?: number
          steps?: number
          updated_at?: string
          user_id?: string
          water?: number
        }
        Relationships: []
      }
      planner_tasks: {
        Row: {
          created_at: string
          day: string
          done: boolean
          duration: string | null
          energy: string | null
          id: string
          source_routine_id: string | null
          time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          done?: boolean
          duration?: string | null
          energy?: string | null
          id?: string
          source_routine_id?: string | null
          time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          done?: boolean
          duration?: string | null
          energy?: string | null
          id?: string
          source_routine_id?: string | null
          time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routine_tasks: {
        Row: {
          anchor_date: string | null
          created_at: string
          duration: string | null
          energy: string | null
          frequency: string
          id: string
          period: string
          position: number
          time: string
          title: string
          updated_at: string
          user_id: string
          weekday: number | null
        }
        Insert: {
          anchor_date?: string | null
          created_at?: string
          duration?: string | null
          energy?: string | null
          frequency?: string
          id?: string
          period?: string
          position?: number
          time?: string
          title: string
          updated_at?: string
          user_id: string
          weekday?: number | null
        }
        Update: {
          anchor_date?: string | null
          created_at?: string
          duration?: string | null
          energy?: string | null
          frequency?: string
          id?: string
          period?: string
          position?: number
          time?: string
          title?: string
          updated_at?: string
          user_id?: string
          weekday?: number | null
        }
        Relationships: []
      }
      running_progress: {
        Row: {
          completed_at: string
          created_at: string
          day: number
          id: string
          user_id: string
          week: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          day: number
          id?: string
          user_id: string
          week: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          day?: number
          id?: string
          user_id?: string
          week?: number
        }
        Relationships: []
      }
      user_prefs: {
        Row: {
          updated_at: string
          user_id: string
          workout_time: string
        }
        Insert: {
          updated_at?: string
          user_id: string
          workout_time?: string
        }
        Update: {
          updated_at?: string
          user_id?: string
          workout_time?: string
        }
        Relationships: []
      }
      week_plan: {
        Row: {
          plan: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          plan?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          plan?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_history: {
        Row: {
          created_at: string
          day: string
          id: string
          user_id: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          user_id: string
          workout_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          user_id?: string
          workout_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
