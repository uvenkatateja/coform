-- Cleanup and Fix Collaboration
-- Run this to clean up and properly set up collaboration

-- Step 1: Drop all collaboration-related policies
DROP POLICY IF EXISTS "Users can view collaborators of their forms" ON public.form_collaborators;
DROP POLICY IF EXISTS "Users can view their own collaborations" ON public.form_collaborators;
DROP POLICY IF EXISTS "Form owners can add collaborators" ON public.form_collaborators;
DROP POLICY IF EXISTS "Form owners can remove collaborators" ON public.form_collaborators;
DROP POLICY IF EXISTS "Users can view own forms or collaborated forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms or collaborated forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update own forms" ON public.forms;

-- Step 2: Drop collaborators table if exists
DROP TABLE IF EXISTS public.form_collaborators CASCADE;

-- Step 3: Add columns to forms if not exists
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS share_token TEXT,
ADD COLUMN IF NOT EXISTS allow_collaboration BOOLEAN DEFAULT false;

-- Step 4: Drop existing constraint if any
ALTER TABLE public.forms DROP CONSTRAINT IF EXISTS forms_share_token_key;

-- Step 5: Add unique constraint
ALTER TABLE public.forms ADD CONSTRAINT forms_share_token_key UNIQUE (share_token);

-- Step 6: Create indexes
DROP INDEX IF EXISTS idx_forms_share_token;
CREATE INDEX idx_forms_share_token ON public.forms(share_token) WHERE share_token IS NOT NULL;

-- Step 7: Create simple, non-recursive policies for forms
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

-- Step 8: Create helper function
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64');
END;
$$ LANGUAGE plpgsql;
