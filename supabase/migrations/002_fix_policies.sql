-- Fix the infinite recursion in forms policies
-- Run this in Supabase SQL Editor

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view own forms or collaborated forms" ON public.forms;

-- Recreate without the recursive check
CREATE POLICY "Users can view own forms or collaborated forms"
  ON public.forms FOR SELECT
  USING (
    auth.uid() = user_id 
    OR is_public = true
    OR (allow_collaboration = true AND share_token IS NOT NULL)
  );
