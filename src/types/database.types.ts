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
      categorias: {
        Row: {
          activa: boolean
          color: string | null
          created_at: string
          hogar_id: string
          icono: string | null
          id: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
        }
        Insert: {
          activa?: boolean
          color?: string | null
          created_at?: string
          hogar_id: string
          icono?: string | null
          id?: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_categoria"]
        }
        Update: {
          activa?: boolean
          color?: string | null
          created_at?: string
          hogar_id?: string
          icono?: string | null
          id?: string
          nombre?: string
          tipo?: Database["public"]["Enums"]["tipo_categoria"]
        }
        Relationships: [
          {
            foreignKeyName: "categorias_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      cuentas: {
        Row: {
          activa: boolean
          created_at: string
          cupo_centavos: number | null
          dia_corte: number | null
          dia_pago: number | null
          entidad: string | null
          hogar_id: string
          id: string
          moneda: string
          nombre: string
          sobrecupo_centavos: number
          tasa_anual: number
          tipo: Database["public"]["Enums"]["tipo_cuenta"]
          titular: string | null
        }
        Insert: {
          activa?: boolean
          created_at?: string
          cupo_centavos?: number | null
          dia_corte?: number | null
          dia_pago?: number | null
          entidad?: string | null
          hogar_id: string
          id?: string
          moneda?: string
          nombre: string
          sobrecupo_centavos?: number
          tasa_anual?: number
          tipo: Database["public"]["Enums"]["tipo_cuenta"]
          titular?: string | null
        }
        Update: {
          activa?: boolean
          created_at?: string
          cupo_centavos?: number | null
          dia_corte?: number | null
          dia_pago?: number | null
          entidad?: string | null
          hogar_id?: string
          id?: string
          moneda?: string
          nombre?: string
          sobrecupo_centavos?: number
          tasa_anual?: number
          tipo?: Database["public"]["Enums"]["tipo_cuenta"]
          titular?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuentas_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      diferidos: {
        Row: {
          created_at: string
          cuenta_id: string
          descripcion: string
          fecha_inicio: string
          hogar_id: string
          id: string
          monto_centavos: number
          numero_cuotas: number
          tasa_anual: number
        }
        Insert: {
          created_at?: string
          cuenta_id: string
          descripcion: string
          fecha_inicio: string
          hogar_id: string
          id?: string
          monto_centavos: number
          numero_cuotas: number
          tasa_anual?: number
        }
        Update: {
          created_at?: string
          cuenta_id?: string
          descripcion?: string
          fecha_inicio?: string
          hogar_id?: string
          id?: string
          monto_centavos?: number
          numero_cuotas?: number
          tasa_anual?: number
        }
        Relationships: [
          {
            foreignKeyName: "diferidos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "diferidos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "v_saldos_cuentas"
            referencedColumns: ["cuenta_id", "hogar_id"]
          },
          {
            foreignKeyName: "diferidos_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      hogares: {
        Row: {
          creado_por: string
          created_at: string
          id: string
          nombre: string
        }
        Insert: {
          creado_por: string
          created_at?: string
          id?: string
          nombre: string
        }
        Update: {
          creado_por?: string
          created_at?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      miembros_hogar: {
        Row: {
          created_at: string
          hogar_id: string
          rol: Database["public"]["Enums"]["rol_hogar"]
          usuario_id: string
        }
        Insert: {
          created_at?: string
          hogar_id: string
          rol?: Database["public"]["Enums"]["rol_hogar"]
          usuario_id: string
        }
        Update: {
          created_at?: string
          hogar_id?: string
          rol?: Database["public"]["Enums"]["rol_hogar"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miembros_hogar_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos: {
        Row: {
          categoria_id: string | null
          creado_por: string | null
          created_at: string
          cuenta_destino_id: string | null
          cuenta_id: string
          descripcion: string | null
          diferido_id: string | null
          fecha: string
          hogar_id: string
          id: string
          monto_centavos: number
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Insert: {
          categoria_id?: string | null
          creado_por?: string | null
          created_at?: string
          cuenta_destino_id?: string | null
          cuenta_id: string
          descripcion?: string | null
          diferido_id?: string | null
          fecha?: string
          hogar_id: string
          id?: string
          monto_centavos: number
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Update: {
          categoria_id?: string | null
          creado_por?: string | null
          created_at?: string
          cuenta_destino_id?: string | null
          cuenta_id?: string
          descripcion?: string | null
          diferido_id?: string | null
          fecha?: string
          hogar_id?: string
          id?: string
          monto_centavos?: number
          tipo?: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_categoria_id_hogar_id_fkey"
            columns: ["categoria_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_cuenta_destino_id_hogar_id_fkey"
            columns: ["cuenta_destino_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_cuenta_destino_id_hogar_id_fkey"
            columns: ["cuenta_destino_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "v_saldos_cuentas"
            referencedColumns: ["cuenta_id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "v_saldos_cuentas"
            referencedColumns: ["cuenta_id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_diferido_id_hogar_id_fkey"
            columns: ["diferido_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "diferidos"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_diferido_id_hogar_id_fkey"
            columns: ["diferido_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "v_diferidos_estado"
            referencedColumns: ["diferido_id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      presupuestos: {
        Row: {
          categoria_id: string
          created_at: string
          hogar_id: string
          id: string
          mes: string
          monto_centavos: number
        }
        Insert: {
          categoria_id: string
          created_at?: string
          hogar_id: string
          id?: string
          mes: string
          monto_centavos: number
        }
        Update: {
          categoria_id?: string
          created_at?: string
          hogar_id?: string
          id?: string
          mes?: string
          monto_centavos?: number
        }
        Relationships: [
          {
            foreignKeyName: "presupuestos_categoria_id_hogar_id_fkey"
            columns: ["categoria_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "presupuestos_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_diferidos_estado: {
        Row: {
          cuenta_id: string | null
          cuota_estimada_centavos: number | null
          cuotas_restantes: number | null
          cuotas_transcurridas: number | null
          descripcion: string | null
          diferido_id: string | null
          fecha_fin_estimada: string | null
          fecha_inicio: string | null
          hogar_id: string | null
          interes_total_estimado_centavos: number | null
          monto_centavos: number | null
          numero_cuotas: number | null
          saldo_capital_estimado_centavos: number | null
          tasa_anual: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diferidos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "diferidos_cuenta_id_hogar_id_fkey"
            columns: ["cuenta_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "v_saldos_cuentas"
            referencedColumns: ["cuenta_id", "hogar_id"]
          },
          {
            foreignKeyName: "diferidos_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      v_gastos_mensuales: {
        Row: {
          categoria_id: string | null
          hogar_id: string | null
          mes: string | null
          tipo: Database["public"]["Enums"]["tipo_movimiento"] | null
          total_centavos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_categoria_id_hogar_id_fkey"
            columns: ["categoria_id", "hogar_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id", "hogar_id"]
          },
          {
            foreignKeyName: "movimientos_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
      v_saldos_cuentas: {
        Row: {
          cuenta_id: string | null
          cupo_centavos: number | null
          cupo_disponible_centavos: number | null
          dia_corte: number | null
          dia_pago: number | null
          entidad: string | null
          hogar_id: string | null
          nombre: string | null
          saldo_centavos: number | null
          sobrecupo_centavos: number | null
          tipo: Database["public"]["Enums"]["tipo_cuenta"] | null
          titular: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuentas_hogar_id_fkey"
            columns: ["hogar_id"]
            isOneToOne: false
            referencedRelation: "hogares"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      es_miembro: { Args: { p_hogar_id: string }; Returns: boolean }
    }
    Enums: {
      rol_hogar: "propietario" | "miembro"
      tipo_categoria: "gasto" | "ingreso"
      tipo_cuenta:
        | "tarjeta_credito"
        | "prestamo"
        | "cuenta_bancaria"
        | "efectivo"
      tipo_movimiento:
        | "ingreso"
        | "gasto"
        | "pago"
        | "transferencia"
        | "interes"
        | "comision"
        | "ajuste"
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
      rol_hogar: ["propietario", "miembro"],
      tipo_categoria: ["gasto", "ingreso"],
      tipo_cuenta: [
        "tarjeta_credito",
        "prestamo",
        "cuenta_bancaria",
        "efectivo",
      ],
      tipo_movimiento: [
        "ingreso",
        "gasto",
        "pago",
        "transferencia",
        "interes",
        "comision",
        "ajuste",
      ],
    },
  },
} as const
