/**
 * Database types - Generated from Supabase
 * Run: npm run db:types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          schema: Json;
          is_public: boolean;
          share_token: string | null;
          allow_collaboration: boolean;
          email_notifications_enabled: boolean;
          notification_emails: string[];
          created_at: string;
          updated_at: string;
          organization_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          schema: Json;
          is_public?: boolean;
          share_token?: string | null;
          allow_collaboration?: boolean;
          email_notifications_enabled?: boolean;
          notification_emails?: string[];
          created_at?: string;
          updated_at?: string;
          organization_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          schema?: Json;
          is_public?: boolean;
          share_token?: string | null;
          allow_collaboration?: boolean;
          email_notifications_enabled?: boolean;
          notification_emails?: string[];
          created_at?: string;
          updated_at?: string;
          organization_id?: string | null;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
      organization_members: {
        Row: {
          organization_id: string;
          user_id: string;
          role: "owner" | "member" | "admin";
          created_at: string;
        };
        Insert: {
          organization_id: string;
          user_id: string;
          role: "owner" | "member" | "admin";
          created_at?: string;
        };
        Update: {
          organization_id?: string;
          user_id?: string;
          role?: "owner" | "member" | "admin";
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          dodo_subscription_id: string;
          dodo_customer_id: string;
          plan_tier: "free" | "pro" | "enterprise";
          status: "active" | "cancelled" | "paused" | "past_due" | "pending";
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          dodo_subscription_id: string;
          dodo_customer_id: string;
          plan_tier: "free" | "pro" | "enterprise";
          status: "active" | "cancelled" | "paused" | "past_due" | "pending";
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          dodo_subscription_id?: string;
          dodo_customer_id?: string;
          plan_tier?: "free" | "pro" | "enterprise";
          status?: "active" | "cancelled" | "paused" | "past_due" | "pending";
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          form_id: string;
          data: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          data: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          data?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_hash: string;
          key_prefix: string;
          is_active: boolean;
          last_used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          key_hash: string;
          key_prefix: string;
          is_active?: boolean;
          last_used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          key_hash?: string;
          key_prefix?: string;
          is_active?: boolean;
          last_used_at?: string | null;
          created_at?: string;
        };
      };
      form_versions: {
        Row: {
          id: string;
          form_id: string;
          version: number;
          schema: Json;
          description: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          version: number;
          schema: Json;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          version?: number;
          schema?: Json;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };

    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
