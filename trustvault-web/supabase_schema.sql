-- Complete TrustVault Supabase Database Schema

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'client' check (role in ('client', 'admin', 'fraud_analyst', 'compliance_officer')),
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  two_factor_enabled boolean default false,
  language text default 'en' check (language in ('en', 'fr', 'ar')),
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Allow public read for authentication matching" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, kyc_status)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'), 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Wallets
create table if not exists public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text default 'checking' check (type in ('savings', 'checking', 'investment', 'crypto')),
  balance numeric default 0 not null,
  currency text default 'DZD' not null,
  is_primary boolean default false,
  status text default 'active' check (status in ('active', 'frozen', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallets enable row level security;

create policy "Users can view their own wallets" on public.wallets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own wallets" on public.wallets
  for insert with check (auth.uid() = user_id);

-- 3. Virtual Cards
create table if not exists public.virtual_cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  last4 text not null,
  brand text default 'visa' check (brand in ('visa', 'mastercard')),
  expiry_month integer not null,
  expiry_year integer not null,
  status text default 'active' check (status in ('active', 'frozen', 'expired', 'cancelled')),
  label text not null,
  color text not null,
  spending_limit numeric,
  spent_this_month numeric default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.virtual_cards enable row level security;

create policy "Users can view their own cards" on public.virtual_cards
  for select using (auth.uid() = user_id);

create policy "Users can update their own cards" on public.virtual_cards
  for update using (auth.uid() = user_id);

-- 4. Transactions
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  card_id uuid references public.virtual_cards(id) on delete set null,
  type text not null,
  amount numeric not null,
  currency text default 'DZD' not null,
  description text not null,
  category text not null,
  counterparty text,
  counterparty_avatar text,
  reference text unique not null,
  status text default 'completed' check (status in ('completed', 'pending', 'failed', 'cancelled')),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- 5. Contacts
create table if not exists public.contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  avatar_url text,
  is_favorite boolean default false,
  last_transfer_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contacts enable row level security;

create policy "Users can view their own contacts" on public.contacts
  for select using (auth.uid() = user_id);

-- 6. Fraud Alerts
create table if not exists public.fraud_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  category text,
  description text,
  amount_involved numeric,
  currency text default 'DZD' not null,
  transaction_ref text,
  card_last4 text,
  latitude double precision,
  longitude double precision,
  status text default 'open' check (status in ('open', 'investigating', 'escalated', 'resolved', 'closed')),
  priority text default 'normal' check (priority in ('critical', 'high', 'normal', 'low')),
  risk_score numeric default 0 not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  resolution_type text check (resolution_type in ('refunded', 'confirmed_fraud', 'false_positive', 'chargeback')),
  resolution_notes text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.fraud_alerts enable row level security;

create policy "Users can view their own alerts" on public.fraud_alerts
  for select using (auth.uid() = user_id or auth.role() = 'authenticated');

-- 7. Emergency Lockdowns
create table if not exists public.emergency_lockdowns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  device_id text,
  trigger_type text not null check (trigger_type in ('manual', 'velocity_rule', 'geo_anomaly', 'failed_auth')),
  latitude double precision,
  longitude double precision,
  cards_frozen boolean default true,
  wallet_frozen boolean default true,
  p2p_disabled boolean default true,
  is_resolved boolean default false,
  resolved_by uuid references public.profiles(id),
  resolution_notes text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.emergency_lockdowns enable row level security;

create policy "Users can view their own lockdowns" on public.emergency_lockdowns
  for select using (auth.uid() = user_id or auth.role() = 'authenticated');
