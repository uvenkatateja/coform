import { createClient } from "@/lib/supabase/client";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];
type FormInsert = Database["public"]["Tables"]["forms"]["Insert"];
type FormUpdate = Database["public"]["Tables"]["forms"]["Update"];

/**
 * Form database operations (client-side)
 * Optimized with proper error handling
 */
export const formQueries = {
  /**
   * Get all forms (optionally filtered by organization)
   */
  async getAll(organizationId: string | null = null): Promise<Form[]> {
    const supabase = createClient();
    let query = supabase
      .from("forms")
      .select("*")
      .order("updated_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    } else {
      query = query.is("organization_id", null);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Get single form by ID
   */
  async getById(id: string): Promise<Form> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create new form
   */
  async create(form: FormInsert): Promise<Form> {
    const supabase = createClient();
    const { data, error } = await (supabase
      .from("forms") as any)
      .insert(form)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update existing form
   */
  async update(id: string, updates: FormUpdate): Promise<Form> {
    const supabase = createClient();
    const { data, error } = await (supabase
      .from("forms") as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Form not found");
    return data[0];
  },

  /**
   * Delete form
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("forms").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};

/**
 * Server-side form queries
 * Used in Server Components and Actions
 */
export const formQueriesServer = {
  async getAll(organizationId: string | null = null): Promise<Form[]> {
    const supabase = await createServerClient();
    let query = supabase
      .from("forms")
      .select("*")
      .order("updated_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    } else {
      query = query.is("organization_id", null);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<Form> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async create(form: FormInsert): Promise<Form> {
    const supabase = await createServerClient();
    const { data, error } = await (supabase
      .from("forms") as any)
      .insert(form)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: string, updates: FormUpdate): Promise<Form> {
    const supabase = await createServerClient();
    const { data, error } = await (supabase
      .from("forms") as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Form not found");
    return data[0];
  },

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from("forms").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};
