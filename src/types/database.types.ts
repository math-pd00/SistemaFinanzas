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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          annual_rate: number
          created_at: string
          credit_limit_cents: number | null
          currency: string
          holder: string | null
          household_id: string
          id: string
          institution: string | null
          is_active: boolean
          name: string
          overlimit_cents: number
          payment_due_day: number | null
          statement_day: number | null
          type: Database["public"]["Enums"]["account_type"]
        }
        Insert: {
          annual_rate?: number
          created_at?: string
          credit_limit_cents?: number | null
          currency?: string
          holder?: string | null
          household_id: string
          id?: string
          institution?: string | null
          is_active?: boolean
          name: string
          overlimit_cents?: number
          payment_due_day?: number | null
          statement_day?: number | null
          type: Database["public"]["Enums"]["account_type"]
        }
        Update: {
          annual_rate?: number
          created_at?: string
          credit_limit_cents?: number | null
          currency?: string
          holder?: string | null
          household_id?: string
          id?: string
          institution?: string | null
          is_active?: boolean
          name?: string
          overlimit_cents?: number
          payment_due_day?: number | null
          statement_day?: number | null
          type?: Database["public"]["Enums"]["account_type"]
        }
        Relationships: [
          {
            foreignKeyName: "accounts_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount_cents: number
          category_id: string
          created_at: string
          household_id: string
          id: string
          month: string
        }
        Insert: {
          amount_cents: number
          category_id: string
          created_at?: string
          household_id: string
          id?: string
          month: string
        }
        Update: {
          amount_cents?: number
          category_id?: string
          created_at?: string
          household_id?: string
          id?: string
          month?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_household_id_fkey"
            columns: ["category_id", "household_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "budgets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          household_id: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          color?: string | null
          created_at?: string
          household_id: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          color?: string | null
          created_at?: string
          household_id?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: [
          {
            foreignKeyName: "categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      household_members: {
        Row: {
          created_at: string
          household_id: string
          role: Database["public"]["Enums"]["household_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          household_id: string
          role?: Database["public"]["Enums"]["household_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          household_id?: string
          role?: Database["public"]["Enums"]["household_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      installment_plans: {
        Row: {
          account_id: string
          amount_cents: number
          annual_rate: number
          created_at: string
          description: string
          household_id: string
          id: string
          installment_count: number
          start_date: string
        }
        Insert: {
          account_id: string
          amount_cents: number
          annual_rate?: number
          created_at?: string
          description: string
          household_id: string
          id?: string
          installment_count: number
          start_date: string
        }
        Update: {
          account_id?: string
          amount_cents?: number
          annual_rate?: number
          created_at?: string
          description?: string
          household_id?: string
          id?: string
          installment_count?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_plans_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "installment_plans_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "v_account_balances"
            referencedColumns: ["account_id", "household_id"]
          },
          {
            foreignKeyName: "installment_plans_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount_cents: number
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          destination_account_id: string | null
          household_id: string
          id: string
          installment_plan_id: string | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          account_id: string
          amount_cents: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination_account_id?: string | null
          household_id: string
          id?: string
          installment_plan_id?: string | null
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          account_id?: string
          amount_cents?: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination_account_id?: string | null
          household_id?: string
          id?: string
          installment_plan_id?: string | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "transactions_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "v_account_balances"
            referencedColumns: ["account_id", "household_id"]
          },
          {
            foreignKeyName: "transactions_category_id_household_id_fkey"
            columns: ["category_id", "household_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "transactions_destination_account_id_household_id_fkey"
            columns: ["destination_account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "transactions_destination_account_id_household_id_fkey"
            columns: ["destination_account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "v_account_balances"
            referencedColumns: ["account_id", "household_id"]
          },
          {
            foreignKeyName: "transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_installment_plan_id_household_id_fkey"
            columns: ["installment_plan_id", "household_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "transactions_installment_plan_id_household_id_fkey"
            columns: ["installment_plan_id", "household_id"]
            isOneToOne: false
            referencedRelation: "v_installment_plan_status"
            referencedColumns: ["installment_plan_id", "household_id"]
          },
        ]
      }
    }
    Views: {
      v_account_balances: {
        Row: {
          account_id: string | null
          available_credit_cents: number | null
          balance_cents: number | null
          credit_limit_cents: number | null
          holder: string | null
          household_id: string | null
          institution: string | null
          name: string | null
          overlimit_cents: number | null
          payment_due_day: number | null
          statement_day: number | null
          type: Database["public"]["Enums"]["account_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      v_installment_plan_status: {
        Row: {
          account_id: string | null
          amount_cents: number | null
          annual_rate: number | null
          description: string | null
          elapsed_installments: number | null
          estimated_end_date: string | null
          estimated_installment_cents: number | null
          estimated_principal_balance_cents: number | null
          estimated_total_interest_cents: number | null
          household_id: string | null
          installment_count: number | null
          installment_plan_id: string | null
          remaining_installments: number | null
          start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_plans_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "installment_plans_account_id_household_id_fkey"
            columns: ["account_id", "household_id"]
            isOneToOne: false
            referencedRelation: "v_account_balances"
            referencedColumns: ["account_id", "household_id"]
          },
          {
            foreignKeyName: "installment_plans_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      v_monthly_expenses: {
        Row: {
          category_id: string | null
          household_id: string | null
          month: string | null
          total_cents: number | null
          type: Database["public"]["Enums"]["transaction_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_household_id_fkey"
            columns: ["category_id", "household_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "household_id"]
          },
          {
            foreignKeyName: "transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_household_member: {
        Args: { p_household_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "credit_card" | "loan" | "bank_account" | "cash"
      category_type: "expense" | "income"
      household_role: "owner" | "member"
      transaction_type:
        | "income"
        | "expense"
        | "payment"
        | "transfer"
        | "interest"
        | "fee"
        | "adjustment"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_type: ["credit_card", "loan", "bank_account", "cash"],
      category_type: ["expense", "income"],
      household_role: ["owner", "member"],
      transaction_type: [
        "income",
        "expense",
        "payment",
        "transfer",
        "interest",
        "fee",
        "adjustment",
      ],
    },
  },
} as const
