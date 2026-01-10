"use server";

import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/actions";

/**
 * Generate shareable editor link (server action)
 */
export async function generateShareToken(formId: string): Promise<string> {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = await createServerClient();

  // Generate random token
  const token = Math.random().toString(36).substring(2, 18);

  const { data, error } = await (supabase
    .from("forms") as any)
    .update({
      share_token: token,
      allow_collaboration: true
    })
    .eq("id", formId)
    .eq("user_id", user.id)
    .select("share_token");

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Form not found or you don't have permission");
  return data[0].share_token!;
}

/**
 * Disable collaboration (server action)
 */
export async function disableCollaboration(formId: string): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = await createServerClient();

  const { error } = await (supabase
    .from("forms") as any)
    .update({
      share_token: null,
      allow_collaboration: false
    })
    .eq("id", formId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}
