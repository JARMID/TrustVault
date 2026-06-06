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
-- Ensure that your user role definitions are mapped securely to custom claims in `auth.jwt() ->> 'role'`

-- =======================================================================================
-- WALLETS TABLE POLICIES
-- =======================================================================================

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Users can only view their own wallets
CREATE POLICY "Users view own wallets" ON wallets
FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert wallets for themselves
CREATE POLICY "Users insert own wallets" ON wallets
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own wallets (balance changes happen server-side via service role)
CREATE POLICY "Users update own wallets" ON wallets
FOR UPDATE USING (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "Admins full access wallets" ON wallets
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst', 'compliance_officer'));

-- =======================================================================================
-- TRANSACTIONS TABLE POLICIES
-- =======================================================================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Clients see only their wallet's transactions
CREATE POLICY "Users view own transactions" ON transactions
FOR SELECT USING (
  wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
);

-- Only service role (Laravel API) inserts transactions
-- (No INSERT policy for authenticated users — backend handles this via service key)

-- Admins / fraud analysts can view all transactions
CREATE POLICY "Admins view all transactions" ON transactions
FOR SELECT USING (
  auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst', 'compliance_officer')
);

-- =======================================================================================
-- VIRTUAL CARDS TABLE POLICIES
-- =======================================================================================

ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;

-- Users see only their own cards
CREATE POLICY "Users view own cards" ON virtual_cards
FOR SELECT USING (auth.uid() = user_id);

-- Service role handles insert/update; no client-direct writes
CREATE POLICY "Admins full access cards" ON virtual_cards
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst'));

-- =======================================================================================
-- AUDIT LOGS TABLE POLICIES
-- =======================================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit trail
CREATE POLICY "Users view own audit logs" ON audit_logs
FOR SELECT USING (auth.uid() = user_id);

-- Only admins / compliance officers can view all logs
CREATE POLICY "Compliance officers view all audit logs" ON audit_logs
FOR SELECT USING (
  auth.jwt() ->> 'role' IN ('admin', 'compliance_officer', 'fraud_analyst')
);

-- Only service role inserts logs — no client writes
-- (Enforce via service key in Laravel; do not grant INSERT to authenticated role)

-- =======================================================================================
-- FRAUD ALERTS TABLE POLICIES
-- =======================================================================================

ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Clients can view alerts raised against their account
CREATE POLICY "Users view own fraud alerts" ON fraud_alerts
FOR SELECT USING (auth.uid() = user_id);

-- Fraud analysts / admins have full access
CREATE POLICY "Analysts full access fraud alerts" ON fraud_alerts
FOR ALL USING (
  auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst', 'compliance_officer')
);

-- =======================================================================================
-- EMERGENCY LOCKDOWNS TABLE POLICIES
-- =======================================================================================

ALTER TABLE emergency_lockdowns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own lockdowns" ON emergency_lockdowns
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "SOC full access lockdowns" ON emergency_lockdowns
FOR ALL USING (
  auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst')
);

-- =======================================================================================
-- WALLET FREEZES TABLE POLICIES
-- =======================================================================================

ALTER TABLE wallet_freezes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet freezes" ON wallet_freezes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Compliance full access wallet freezes" ON wallet_freezes
FOR ALL USING (
  auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst', 'compliance_officer')
);

