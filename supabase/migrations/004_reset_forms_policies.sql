-- Reset forms policies to working state
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing forms policies
DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view public forms" ON public.forms;
DROP POLICY IF EXISTS "Users can create own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can delete own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view own forms or public forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view own forms or collaborated forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms or collaborated forms" ON public.forms;

-- Step 2: Add collaboration columns if not exist
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS share_token TEXT,
ADD COLUMN IF NOT EXISTS allow_collaboration BOOLEAN DEFAULT false;

-- Step 3: Create clean, simple policies

-- SELECT: Owner can view their forms, anyone can view public forms
CREATE POLICY "forms_select_own"
  ON public.forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "forms_select_public"
  ON public.forms FOR SELECT
  USING (is_public = true);

CREATE POLICY "forms_select_shared"
  ON public.forms FOR SELECT
  USING (allow_collaboration = true AND share_token IS NOT NULL);

-- INSERT: Users can create their own forms
CREATE POLICY "forms_insert_own"
  ON public.forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own forms
CREATE POLICY "forms_update_own"
  ON public.forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own forms
CREATE POLICY "forms_delete_own"
  ON public.forms FOR DELETE
  USING (auth.uid() = user_id);
