-- Add email notification columns to forms table
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_emails TEXT[] DEFAULT '{}';

-- Comment for documentation
COMMENT ON COLUMN public.forms.email_notifications_enabled IS 'Whether to send email on new submission';
COMMENT ON COLUMN public.forms.notification_emails IS 'Array of email addresses to notify';
