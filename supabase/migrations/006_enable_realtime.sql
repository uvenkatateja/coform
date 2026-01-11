-- Enable Realtime for forms table
-- Required for postgres_changes to work properly

-- Enable REPLICA IDENTITY FULL on forms table
-- This sends the full row data on UPDATE events
ALTER TABLE public.forms REPLICA IDENTITY FULL;

-- Enable realtime for the forms table (must be done in Supabase Dashboard)
-- Go to Database → Replication → Enable for 'forms' table
-- Or run: ALTER PUBLICATION supabase_realtime ADD TABLE forms;

-- Note: You must also enable Realtime in the Supabase Dashboard:
-- 1. Go to Database → Replication
-- 2. Under "Source", enable realtime for the 'forms' table
-- 3. Or run the commented SQL below if you have permissions:
-- ALTER PUBLICATION supabase_realtime ADD TABLE forms;
