-- Complete Collaboration Migration
-- Run this entire file in Supabase SQL Editor

-- Step 1: Add columns to forms table
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS allow_collaboration BOOLEAN DEFAULT false;

-- Step 2: Create collaborators table
CREATE TABLE IF NOT EXISTS public.form_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(form_id, user_id)
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_collaborators_form_id ON public.form_collaborators(form_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.form_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_share_token ON public.forms(share_token);

-- Step 4: Enable RLS on collaborators
ALTER TABLE public.form_collaborators ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop old policies
DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view own forms or collaborated forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms or collaborated forms" ON public.forms;

-- Step 6: Create new simplified policies for forms
CREATE POLICY "Users can view own forms or public forms"
  ON public.forms FOR SELECT
  USING (
    auth.uid() = user_id 
    OR is_public = true
    OR (allow_collaboration = true AND share_token IS NOT NULL)
  );

CREATE POLICY "Users can update own forms"
  ON public.forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 7: Create collaborators policies
CREATE POLICY "Users can view collaborators of their forms"
  ON public.form_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_collaborators.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own collaborations"
  ON public.form_collaborators FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Form owners can add collaborators"
  ON public.form_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_collaborators.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Form owners can remove collaborators"
  ON public.form_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_collaborators.form_id
      AND forms.user_id = auth.uid()
    )
  );

-- Step 8: Create helper function
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64');
END;
$$ LANGUAGE plpgsql;
