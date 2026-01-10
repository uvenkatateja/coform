-- Allow collaborators to update forms via share token
-- Run this in Supabase SQL Editor

-- Add policy for collaborators to update shared forms
CREATE POLICY "forms_update_shared"
  ON public.forms FOR UPDATE
  USING (allow_collaboration = true AND share_token IS NOT NULL)
  WITH CHECK (allow_collaboration = true AND share_token IS NOT NULL);
