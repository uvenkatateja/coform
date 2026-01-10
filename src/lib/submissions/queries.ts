import { createClient } from "@/lib/supabase/client";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];
type SubmissionInsert = Database["public"]["Tables"]["submissions"]["Insert"];

/**
 * Submission queries (client-side)
 */
export const submissionQueries = {
  async getByFormId(formId: string): Promise<Submission[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};

/**
 * Server-side submission queries
 */
export const submissionQueriesServer = {
  async getByFormId(formId: string): Promise<Submission[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(submission: SubmissionInsert): Promise<Submission> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .insert(submission as any)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
