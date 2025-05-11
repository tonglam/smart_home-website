-- Set REPLICA IDENTITY to FULL for tables used in Supabase Realtime.
-- This ensures that the `old` record data is available for UPDATE and DELETE events,
-- and generally ensures better behavior for INSERTs with Realtime.

-- Table: event_log
ALTER TABLE public.event_log REPLICA IDENTITY FULL;
COMMENT ON TABLE public.event_log IS 'Set REPLICA IDENTITY to FULL for Supabase Realtime event_log subscriptions.';

-- Table: alert_log
ALTER TABLE public.alert_log REPLICA IDENTITY FULL;
COMMENT ON TABLE public.alert_log IS 'Set REPLICA IDENTITY to FULL for Supabase Realtime alert_log subscriptions.';

-- Table: devices (Added for SecuritySection Realtime updates)
ALTER TABLE public.devices REPLICA IDENTITY FULL;
COMMENT ON TABLE public.devices IS 'Set REPLICA IDENTITY to FULL for Supabase Realtime device status updates (SecuritySection).';

-- Add other tables here if needed, for example:
-- ALTER TABLE public.devices REPLICA IDENTITY FULL;

-- Verification Query:
-- Check the REPLICA IDENTITY for all tables in the public schema.
-- Look for 'f' (full) in relreplident for your Realtime-enabled tables.
SELECT
    c.relname AS table_name,
    CASE c.relreplident
        WHEN 'd' THEN 'default (primary key)'
        WHEN 'n' THEN 'nothing'
        WHEN 'f' THEN 'full (all columns)'
        WHEN 'i' THEN 'index'
        ELSE 'unknown'
    END AS replica_identity,
    pg_catalog.obj_description(c.oid, 'pg_class') as table_comment
FROM
    pg_catalog.pg_class c
LEFT JOIN
    pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE
    c.relkind = 'r' -- 'r' for ordinary table
    AND n.nspname = 'public' -- Filter for public schema, or change as needed
ORDER BY
    c.relname;

-- Expected output for event_log and alert_log (among other tables) should show:
-- table_name | replica_identity   | table_comment
-- -----------|--------------------|--------------------------------------------------------------------------
-- alert_log  | full (all columns) | Set REPLICA IDENTITY to FULL for Supabase Realtime alert_log subscriptions.
-- event_log  | full (all columns) | Set REPLICA IDENTITY to FULL for Supabase Realtime event_log subscriptions. 