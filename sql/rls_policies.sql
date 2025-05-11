-- Enable Row Level Security and create SELECT policies for authenticated users

-- Comprehensive RLS Policies --
-- Review and tighten these policies for production!

-- === Table: devices ===
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Authenticated users: Broad permissions (review and restrict!)
CREATE POLICY "Allow authenticated users full access to devices" 
ON public.devices
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Anon users: Read-only access (if needed, e.g., for public device info)
-- CREATE POLICY "Allow anon users to select devices" ON public.devices FOR SELECT TO anon USING (true);

-- Anon users: Read-only for Realtime subscriptions for device status (SecuritySection)
-- WARNING: This allows anon to SELECT all columns from devices that are part of the publication.
-- Review carefully for production if devices table contains sensitive data beyond id, current_state, last_updated.
CREATE POLICY "Allow anon users to select devices for Realtime Status" 
ON public.devices
FOR SELECT 
TO anon 
USING (true);

-- === Table: user_homes ===
ALTER TABLE public.user_homes ENABLE ROW LEVEL SECURITY;

-- Authenticated users: Typically, users can only manage their own home associations.
-- This is a broad policy for now; a more specific one is commented below.
CREATE POLICY "Allow authenticated users full access to user_homes" 
ON public.user_homes
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
/* -- Example: More restrictive policy for user_homes (users manage their own records)
DROP POLICY IF EXISTS "Allow authenticated users full access to user_homes" ON public.user_homes;
CREATE POLICY "Users can manage their own home associations" 
ON public.user_homes
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
*/

-- Anon users: Generally no access to user_homes.
-- CREATE POLICY "Disallow anon access to user_homes" ON public.user_homes FOR SELECT TO anon USING (false);

-- === Table: event_log ===
-- Used for Realtime: YES (listening to UPDATE events, but * needs SELECT)
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;

-- Authenticated users: Broad SELECT for Realtime and general access (review and restrict!)
CREATE POLICY "Allow authenticated users to select event_log"
ON public.event_log
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users: Broad INSERT/UPDATE/DELETE (review and restrict!)
CREATE POLICY "Allow authenticated users to modify event_log"
ON public.event_log
FOR ALL
TO authenticated
USING (true) -- Controls what rows can be affected by UPDATE/DELETE
WITH CHECK (true); -- Controls what data can be INSERTED/UPDATED

-- Anon users: Read-only for Realtime subscriptions (CRITICAL FOR TEST SCRIPT)
CREATE POLICY "Allow anon users to select event_log for Realtime"
ON public.event_log
FOR SELECT 
TO anon 
USING (true);

/* -- Example: Restrictive event_log SELECT for authenticated users (related to their homes)
DROP POLICY IF EXISTS "Allow authenticated users to select event_log" ON public.event_log;
CREATE POLICY "Users can only select event_logs for their homes"
ON public.event_log
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.user_homes uh WHERE uh.user_id = auth.uid() AND uh.home_id = public.event_log.home_id
  )
);
*/

-- === Table: alert_log ===
-- Used for Realtime: YES (listening to INSERT events, but * needs SELECT)
ALTER TABLE public.alert_log ENABLE ROW LEVEL SECURITY;

-- Authenticated users: Broad SELECT for Realtime and general access (review and restrict!)
CREATE POLICY "Allow authenticated users to select alert_log"
ON public.alert_log
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users: Broad INSERT/UPDATE/DELETE (review and restrict!)
CREATE POLICY "Allow authenticated users to modify alert_log"
ON public.alert_log
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Anon users: Read-only for Realtime subscriptions (CRITICAL FOR TEST SCRIPT)
CREATE POLICY "Allow anon users to select alert_log for Realtime"
ON public.alert_log
FOR SELECT 
TO anon 
USING (true);

/* -- Example: Restrictive alert_log SELECT for authenticated users (related to their homes)
DROP POLICY IF EXISTS "Allow authenticated users to select alert_log" ON public.alert_log;
CREATE POLICY "Users can only select alert_logs for their homes"
ON public.alert_log
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.user_homes uh WHERE uh.user_id = auth.uid() AND uh.home_id = public.alert_log.home_id
  )
);
*/

-- ====================================================================
-- FINAL REMINDER: THESE ARE BROAD POLICIES FOR DEVELOPMENT/TESTING.
-- REVIEW AND TIGHTEN ALL `USING` AND `WITH CHECK` CLAUSES 
-- BASED ON YOUR APPLICATION'S SPECIFIC SECURITY REQUIREMENTS BEFORE PRODUCTION.
-- ====================================================================
