-- Form Versions table for tracking form history
CREATE TABLE IF NOT EXISTS public.form_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  schema JSONB NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique version numbers per form
  UNIQUE(form_id, version)
);

-- Index for efficient version lookups
CREATE INDEX IF NOT EXISTS idx_form_versions_form_id 
  ON public.form_versions(form_id);

CREATE INDEX IF NOT EXISTS idx_form_versions_created_at 
  ON public.form_versions(form_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;

-- Users can view versions of their own forms
CREATE POLICY "Users can view own form versions"
  ON public.form_versions FOR SELECT
  USING (
    form_id IN (
      SELECT id FROM public.forms WHERE user_id = auth.uid()
    )
  );

-- Users can create versions for their own forms
CREATE POLICY "Users can create own form versions"
  ON public.form_versions FOR INSERT
  WITH CHECK (
    form_id IN (
      SELECT id FROM public.forms WHERE user_id = auth.uid()
    )
  );

-- Users can delete versions of their own forms
CREATE POLICY "Users can delete own form versions"
  ON public.form_versions FOR DELETE
  USING (
    form_id IN (
      SELECT id FROM public.forms WHERE user_id = auth.uid()
    )
  );
