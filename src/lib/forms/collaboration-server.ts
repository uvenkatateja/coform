import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];

/**
 * Check if user can edit form (server-side)
 */
export async function canEditForm(formId: string, userId: string): Promise<boolean> {
  const supabase = await createServerClient();
  
  // Check if owner
  const { data: form } = await supabase
    .from("forms")
    .select("user_id")
    .eq("id", formId)
    .single();
  
  if ((form as { user_id: string } | null)?.user_id === userId) return true;
  
  // Check if collaborator (future feature)
  return false;
}

/**
 * Get form by share token (server-side)
 */
export async function getFormByShareToken(token: string): Promise<Form> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("share_token", token)
    .eq("allow_collaboration", true)
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}
