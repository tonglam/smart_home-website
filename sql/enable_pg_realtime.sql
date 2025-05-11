ALTER PUBLICATION supabase_realtime ADD TABLE event_log;
ALTER PUBLICATION supabase_realtime ADD TABLE alert_log;

-- Add devices table for SecuritySection Realtime updates
ALTER PUBLICATION supabase_realtime ADD TABLE devices;

-- To add all tables in the public schema (use with caution, might include tables you don't need): 