export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          closing_day: number | null
          due_day: number | null
          household_id: string | null
          id: string
          is_archived: boolean | null
          name: string
          opening_balance: number | null
          type: string | null
        }
        Insert: {
          closing_day?: number | null
          due_day?: number | null
          household_id?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          opening_balance?: number | null
          type?: string | null
        }
        Update: {
          closing_day?: number | null
          due_day?: number | null
          household_id?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          opening_balance?: number | null
          type?: string | null
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
      app_users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          household_id: string | null
          id: string
          is_active: boolean | null
          password_hash: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          household_id?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          household_id?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_users_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          household_id: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          household_id?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          household_id?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          household_id: string | null
          id: string
          name: string
        }
        Insert: {
          household_id?: string | null
          id?: string
          name: string
        }
        Update: {
          household_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_payments: {
        Row: {
          amount: number | null
          debt_id: string | null
          due_date: string | null
          id: string
          interest_component: number | null
          paid_at: string | null
          principal_component: number | null
        }
        Insert: {
          amount?: number | null
          debt_id?: string | null
          due_date?: string | null
          id?: string
          interest_component?: number | null
          paid_at?: string | null
          principal_component?: number | null
        }
        Update: {
          amount?: number | null
          debt_id?: string | null
          due_date?: string | null
          id?: string
          interest_component?: number | null
          paid_at?: string | null
          principal_component?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "debt_payments_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          creditor: string
          end_date: string | null
          household_id: string | null
          id: string
          interest_rate_apr: number | null
          payment_day: number | null
          principal: number | null
          start_date: string | null
          type: string | null
        }
        Insert: {
          creditor: string
          end_date?: string | null
          household_id?: string | null
          id?: string
          interest_rate_apr?: number | null
          payment_day?: number | null
          principal?: number | null
          start_date?: string | null
          type?: string | null
        }
        Update: {
          creditor?: string
          end_date?: string | null
          household_id?: string | null
          id?: string
          interest_rate_apr?: number | null
          payment_day?: number | null
          principal?: number | null
          start_date?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debts_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          household_id: string | null
          id: string
          linked_account_id: string | null
          name: string | null
          notes: string | null
          target_amount: number | null
          target_date: string | null
        }
        Insert: {
          household_id?: string | null
          id?: string
          linked_account_id?: string | null
          name?: string | null
          notes?: string | null
          target_amount?: number | null
          target_date?: string | null
        }
        Update: {
          household_id?: string | null
          id?: string
          linked_account_id?: string | null
          name?: string | null
          notes?: string | null
          target_amount?: number | null
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      household_members: {
        Row: {
          household_id: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          household_id?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          household_id?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          name: string
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          name: string
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
      installments: {
        Row: {
          account_id: string | null
          amount: number | null
          due_date: string | null
          household_id: string | null
          id: string
          n_current: number | null
          n_total: number | null
          paid: boolean | null
          purchase_id: string | null
        }
        Insert: {
          account_id?: string | null
          amount?: number | null
          due_date?: string | null
          household_id?: string | null
          id?: string
          n_current?: number | null
          n_total?: number | null
          paid?: boolean | null
          purchase_id?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number | null
          due_date?: string | null
          household_id?: string | null
          id?: string
          n_current?: number | null
          n_total?: number | null
          paid?: boolean | null
          purchase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installments_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installments_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string | null
          household_id: string | null
          id: string
          location: string | null
          min_quantity: number | null
          name: string | null
          quantity: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          household_id?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          name?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          household_id?: string | null
          id?: string
          location?: string | null
          min_quantity?: number | null
          name?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          household_id: string | null
          id: string
          tags: string[] | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          household_id?: string | null
          id?: string
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          household_id?: string | null
          id?: string
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          household_id: string | null
          id: string
          price: number | null
          product_id: string | null
          purchased_at: string | null
          store: string | null
        }
        Insert: {
          household_id?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          purchased_at?: string | null
          store?: string | null
        }
        Update: {
          household_id?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          purchased_at?: string | null
          store?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      products_catalog: {
        Row: {
          brand: string | null
          category: string | null
          household_id: string | null
          id: string
          name: string | null
          unit: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          unit?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_catalog_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      projections_cache: {
        Row: {
          as_of_date: string | null
          created_at: string | null
          horizon_days: number | null
          household_id: string | null
          id: string
          payload: Json | null
        }
        Insert: {
          as_of_date?: string | null
          created_at?: string | null
          horizon_days?: number | null
          household_id?: string | null
          id?: string
          payload?: Json | null
        }
        Update: {
          as_of_date?: string | null
          created_at?: string | null
          horizon_days?: number | null
          household_id?: string | null
          id?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "projections_cache_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          household_id: string | null
          id: string
          name: string
        }
        Insert: {
          budget?: number | null
          household_id?: string | null
          id?: string
          name: string
        }
        Update: {
          budget?: number | null
          household_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          account_id: string | null
          card_last4: string | null
          description: string | null
          first_due_date: string | null
          household_id: string | null
          id: string
          n_installments: number | null
          total_amount: number | null
        }
        Insert: {
          account_id?: string | null
          card_last4?: string | null
          description?: string | null
          first_due_date?: string | null
          household_id?: string | null
          id?: string
          n_installments?: number | null
          total_amount?: number | null
        }
        Update: {
          account_id?: string | null
          card_last4?: string | null
          description?: string | null
          first_due_date?: string | null
          household_id?: string | null
          id?: string
          n_installments?: number | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      recurrences: {
        Row: {
          active: boolean | null
          end_date: string | null
          frequency: string | null
          household_id: string | null
          id: string
          next_run_at: string | null
          start_date: string
          template: Json
        }
        Insert: {
          active?: boolean | null
          end_date?: string | null
          frequency?: string | null
          household_id?: string | null
          id?: string
          next_run_at?: string | null
          start_date: string
          template: Json
        }
        Update: {
          active?: boolean | null
          end_date?: string | null
          frequency?: string | null
          household_id?: string | null
          id?: string
          next_run_at?: string | null
          start_date?: string
          template?: Json
        }
        Relationships: [
          {
            foreignKeyName: "recurrences_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          household_id: string | null
          id: string
          payload: Json | null
          period_end: string | null
          period_start: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          household_id?: string | null
          id?: string
          payload?: Json | null
          period_end?: string | null
          period_start?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          household_id?: string | null
          id?: string
          payload?: Json | null
          period_end?: string | null
          period_start?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      secure_documents: {
        Row: {
          created_at: string | null
          doc_type: string | null
          encrypted_key: string | null
          file_url: string | null
          household_id: string | null
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type?: string | null
          encrypted_key?: string | null
          file_url?: string | null
          household_id?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string | null
          encrypted_key?: string | null
          file_url?: string | null
          household_id?: string | null
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secure_documents_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          checked: boolean | null
          id: string
          list_id: string | null
          name: string | null
          product_id: string | null
          quantity: number | null
          unit: string | null
        }
        Insert: {
          checked?: boolean | null
          id?: string
          list_id?: string | null
          name?: string | null
          product_id?: string | null
          quantity?: number | null
          unit?: string | null
        }
        Update: {
          checked?: boolean | null
          id?: string
          list_id?: string | null
          name?: string | null
          product_id?: string | null
          quantity?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          household_id: string | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          active: boolean | null
          amount: number | null
          billing_cycle: string | null
          household_id: string | null
          id: string
          next_charge_date: string | null
          payment_account_id: string | null
          service_name: string | null
        }
        Insert: {
          active?: boolean | null
          amount?: number | null
          billing_cycle?: string | null
          household_id?: string | null
          id?: string
          next_charge_date?: string | null
          payment_account_id?: string | null
          service_name?: string | null
        }
        Update: {
          active?: boolean | null
          amount?: number | null
          billing_cycle?: string | null
          household_id?: string | null
          id?: string
          next_charge_date?: string | null
          payment_account_id?: string | null
          service_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_payment_account_id_fkey"
            columns: ["payment_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          cost_center_id: string | null
          created_at: string | null
          description: string | null
          household_id: string | null
          id: string
          project_id: string | null
          transaction_date: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          description?: string | null
          household_id?: string | null
          id?: string
          project_id?: string | null
          transaction_date: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          description?: string | null
          household_id?: string | null
          id?: string
          project_id?: string | null
          transaction_date?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_expenses: {
        Row: {
          amount: number | null
          description: string | null
          expense_date: string | null
          id: string
          paid_by: string | null
          trip_id: string | null
        }
        Insert: {
          amount?: number | null
          description?: string | null
          expense_date?: string | null
          id?: string
          paid_by?: string | null
          trip_id?: string | null
        }
        Update: {
          amount?: number | null
          description?: string | null
          expense_date?: string | null
          id?: string
          paid_by?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget: number | null
          destination: string | null
          end_date: string | null
          household_id: string | null
          id: string
          name: string | null
          start_date: string | null
        }
        Insert: {
          budget?: number | null
          destination?: string | null
          end_date?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          start_date?: string | null
        }
        Update: {
          budget?: number | null
          destination?: string | null
          end_date?: string | null
          household_id?: string | null
          id?: string
          name?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          id: string
          locale: string | null
          notifications: Json | null
          theme: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          locale?: string | null
          notifications?: Json | null
          theme?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          locale?: string | null
          notifications?: Json | null
          theme?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
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
