export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: 'admin' | 'staff'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: 'admin' | 'staff'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: 'admin' | 'staff'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
      rooms: {
        Row: {
          id: string
          name: string
          floor_number: number
          description: string | null
          is_maintenance: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          floor_number?: number
          description?: string | null
          is_maintenance?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          floor_number?: number
          description?: string | null
          is_maintenance?: boolean
          created_at?: string
        }
        Relationships: []
      }
      storage_units: {
        Row: {
          id: string
          room_id: string
          parent_id: string | null
          name: string
          x: number
          y: number
          z: number
          is_assignable: boolean
          status: 'available' | 'low_space' | 'full'
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          parent_id?: string | null
          name: string
          x?: number
          y?: number
          z?: number
          is_assignable?: boolean
          status?: 'available' | 'low_space' | 'full'
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          parent_id?: string | null
          name?: string
          x?: number
          y?: number
          z?: number
          is_assignable?: boolean
          status?: 'available' | 'low_space' | 'full'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "storage_units"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "storage_units_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedSchema: "public"
          }
        ]
      }
      reports: {
        Row: {
          id: string
          unit_id: string
          title: string
          client: string | null
          metadata: Json
          embedding: string | null
          status: 'pending' | 'archived' | 'loaned'
          created_by: string
          current_holder_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          title: string
          client?: string | null
          metadata?: Json
          embedding?: string | null
          status?: 'pending' | 'archived' | 'loaned'
          created_by: string
          current_holder_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          title?: string
          client?: string | null
          metadata?: Json
          embedding?: string | null
          status?: 'pending' | 'archived' | 'loaned'
          created_by?: string
          current_holder_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "reports_current_holder_id_fkey"
            columns: ["current_holder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "storage_units"
            referencedSchema: "public"
          }
        ]
      }
      report_logs: {
        Row: {
          id: string
          report_id: string
          action: string
          from_user_id: string | null
          to_user_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          action: string
          from_user_id?: string | null
          to_user_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          action?: string
          from_user_id?: string | null
          to_user_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_logs_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "report_logs_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "report_logs_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_room_in_maintenance: {
        Args: {
          p_room_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'admin' | 'staff'
      unit_status: 'available' | 'low_space' | 'full'
      report_status: 'pending' | 'archived' | 'loaned'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

