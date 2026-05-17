-- =======================================================================================
-- TRUSTDESK: SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================================================

-- 1. Enforce RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_signals ENABLE ROW LEVEL SECURITY;

-- =======================================================================================
-- USERS TABLE POLICIES
-- =======================================================================================

-- Admins can view/edit everything
CREATE POLICY "Admins have full access to users" ON users
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Users can only view and edit their own profile
CREATE POLICY "Users can only view their own profile" ON users
FOR SELECT USING (
  auth.uid() = id
);
CREATE POLICY "Users can only edit their own profile" ON users
FOR UPDATE USING (
  auth.uid() = id
);

-- =======================================================================================
-- INCIDENTS POLICIES
-- =======================================================================================

-- Employees can only view incidents they reported
CREATE POLICY "Employees can view own incidents" ON incidents
FOR SELECT USING (
  auth.uid() = reporter_id
);

-- Employees can insert/report new incidents
CREATE POLICY "Employees can insert own incidents" ON incidents
FOR INSERT WITH CHECK (
  auth.uid() = reporter_id
);

-- SOC/Support Role: Can view and update assigned incidents or all incidents if admin
CREATE POLICY "SOC can view all incidents" ON incidents
FOR SELECT USING (
  auth.jwt() ->> 'role' IN ('soc_analyst', 'admin', 'supervisor')
);

CREATE POLICY "SOC can update incidents" ON incidents
FOR UPDATE USING (
  auth.jwt() ->> 'role' IN ('soc_analyst', 'admin', 'supervisor')
);

-- =======================================================================================
-- COMMUNITY SIGNALS POLICIES
-- =======================================================================================

-- We want employees to view heatmap data anonymously, without disclosing reporter
-- Supabase Views or Security definer functions are better, but we allow basic select
CREATE POLICY "All authenticated users can view community signals" ON community_signals
FOR SELECT USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Employees can submit community signals anonymously" ON community_signals
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() = reporter_id  -- Ensured at database layer, UI hides it
);

-- =======================================================================================
-- PANIC EVENTS
-- =======================================================================================

-- Only admins/soc can see panic events geographically
CREATE POLICY "SOC can view panic events" ON panic_events
FOR SELECT USING (
  auth.jwt() ->> 'role' IN ('soc_analyst', 'admin')
);

-- Employees can only INSERT panic events representing themselves
CREATE POLICY "Employees can insert panic events for themselves" ON panic_events
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- NOTE: Execute this script inside your Supabase "SQL Editor" once the project is created.
-- Ensure that your user role definitions are mapped securely to custom claims in `auth.jwt() ->> 'role'`.
