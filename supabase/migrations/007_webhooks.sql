-- Webhooks table
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{"submission.created"}',
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for form lookups
CREATE INDEX IF NOT EXISTS idx_webhooks_form_id ON public.webhooks(form_id);

-- Enable RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view webhooks for own forms"
  ON public.webhooks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = webhooks.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create webhooks for own forms"
  ON public.webhooks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = webhooks.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update webhooks for own forms"
  ON public.webhooks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = webhooks.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete webhooks for own forms"
  ON public.webhooks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = webhooks.form_id
      AND forms.user_id = auth.uid()
    )
  );
