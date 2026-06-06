-- TrustDesk Supabase Schema

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  kyc_status TEXT CHECK (kyc_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  language TEXT CHECK (language IN ('en', 'fr', 'ar')) DEFAULT 'en',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('savings', 'checking', 'investment', 'crypto')),
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'DZD',
  is_primary BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('active', 'frozen', 'closed')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual Cards
CREATE TABLE IF NOT EXISTS public.virtual_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  last4 TEXT NOT NULL,
  brand TEXT CHECK (brand IN ('visa', 'mastercard')),
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('active', 'frozen', 'expired', 'cancelled')) DEFAULT 'active',
  label TEXT,
  color TEXT,
  spending_limit NUMERIC,
  spent_this_month NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.virtual_cards(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('credit', 'debit', 'p2p_in', 'p2p_out', 'bill_payment', 'top_up', 'withdrawal', 'refund')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'DZD',
  description TEXT,
  category TEXT CHECK (category IN ('food', 'transport', 'shopping', 'entertainment', 'utilities', 'health', 'education', 'salary', 'transfer', 'other')),
  counterparty TEXT,
  counterparty_avatar TEXT,
  reference TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  last_transfer_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('transaction', 'security', 'system', 'promotion')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies (Assuming 'authenticated' role matches user_id)
CREATE POLICY "Users can see their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can see their wallets" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their cards" ON public.virtual_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their contacts" ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Fraud Alerts
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('unauthorized_transaction', 'card_fraud', 'identity_theft', 'phishing', 'dispute', 'suspicious_activity')),
  category TEXT CHECK (category IN ('card', 'wallet', 'p2p', 'merchant', 'account')),
  description TEXT,
  amount_involved NUMERIC,
  currency TEXT DEFAULT 'DZD',
  transaction_ref TEXT,
  card_last4 TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT CHECK (status IN ('open', 'investigating', 'escalated', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('critical', 'high', 'normal', 'low')) DEFAULT 'normal',
  risk_score NUMERIC DEFAULT 0,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolution_type TEXT CHECK (resolution_type IN ('refunded', 'confirmed_fraud', 'false_positive', 'chargeback')),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Alert Evidence
CREATE TABLE IF NOT EXISTS public.fraud_alert_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fraud_alert_id UUID REFERENCES public.fraud_alerts(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency Lockdowns
CREATE TABLE IF NOT EXISTS public.emergency_lockdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  device_id TEXT,
  trigger_type TEXT CHECK (trigger_type IN ('manual', 'velocity_rule', 'geo_anomaly', 'failed_auth')),
  latitude NUMERIC,
  longitude NUMERIC,
  cards_frozen BOOLEAN DEFAULT FALSE,
  wallet_frozen BOOLEAN DEFAULT FALSE,
  p2p_disabled BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Freezes
CREATE TABLE IF NOT EXISTS public.wallet_freezes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  fraud_alert_id UUID REFERENCES public.fraud_alerts(id) ON DELETE SET NULL,
  emergency_lockdown_id UUID REFERENCES public.emergency_lockdowns(id) ON DELETE SET NULL,
  scope TEXT CHECK (scope IN ('full', 'card_only', 'p2p_only', 'withdrawal_only')),
  status TEXT CHECK (status IN ('frozen', 'active', 'pending_unfreeze')) DEFAULT 'frozen',
  is_manual_override BOOLEAN DEFAULT FALSE,
  action_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason TEXT,
  frozen_at TIMESTAMPTZ,
  unfrozen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Actions
CREATE TABLE IF NOT EXISTS public.alert_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fraud_alert_id UUID REFERENCES public.fraud_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('assigned', 'escalated', 'contacted_user', 'freeze_wallet', 'unfreeze_wallet', 'refund_initiated', 'chargeback_filed', 'resolved', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alert_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_lockdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_freezes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for new tables
CREATE POLICY "Users can see their own fraud alerts" ON public.fraud_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their own emergency lockdowns" ON public.emergency_lockdowns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their own wallet freezes" ON public.wallet_freezes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can see their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
