/**
 * TrustVault — Database Type Definitions
 * These types mirror the backend schema and are used across all hooks and components.
 */

// ── Users ──
export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'client' | 'admin' | 'fraud_analyst' | 'compliance_officer';
  kyc_status: 'pending' | 'verified' | 'rejected';
  two_factor_enabled: boolean;
  language: 'en' | 'fr' | 'ar';
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ── Wallets ──
export interface DbWallet {
  id: string;
  user_id: string;
  name: string;
  type: 'savings' | 'checking' | 'investment' | 'crypto';
  balance: number;
  currency: string;
  is_primary: boolean;
  status: 'active' | 'frozen' | 'closed';
  created_at: string;
}

// ── Virtual Cards ──
export interface DbVirtualCard {
  id: string;
  user_id: string;
  wallet_id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  expiry_month: number;
  expiry_year: number;
  status: 'active' | 'frozen' | 'expired' | 'cancelled';
  label: string;
  color: string;
  spending_limit: number | null;
  spent_this_month: number;
  created_at: string;
}

// ── Transactions ──
export type TransactionType = 'credit' | 'debit' | 'p2p_in' | 'p2p_out' | 'bill_payment' | 'top_up' | 'withdrawal' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type TransactionCategory =
  | 'food' | 'transport' | 'shopping' | 'entertainment' | 'utilities'
  | 'health' | 'education' | 'salary' | 'transfer' | 'other';

export interface DbTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  card_id: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  counterparty: string | null;
  counterparty_avatar: string | null;
  reference: string;
  status: TransactionStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ── Contacts (P2P) ──
export interface DbContact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_favorite: boolean;
  last_transfer_at: string | null;
  created_at: string;
}

// ── Fraud Alerts (replaces legacy Incidents) ──
export type FraudAlertType =
  | 'unauthorized_transaction' | 'card_fraud' | 'identity_theft'
  | 'phishing' | 'dispute' | 'suspicious_activity';
export type FraudAlertCategory = 'card' | 'wallet' | 'p2p' | 'merchant' | 'account';
export type FraudAlertStatus = 'open' | 'investigating' | 'escalated' | 'resolved' | 'closed';
export type FraudAlertPriority = 'critical' | 'high' | 'normal' | 'low';
export type ResolutionType = 'refunded' | 'confirmed_fraud' | 'false_positive' | 'chargeback';

export interface DbFraudAlert {
  id: string;
  user_id: string;
  type: FraudAlertType;
  category: FraudAlertCategory | null;
  description: string | null;
  amount_involved: number | null;
  currency: string;
  transaction_ref: string | null;
  card_last4: string | null;
  latitude: number | null;
  longitude: number | null;
  status: FraudAlertStatus;
  priority: FraudAlertPriority;
  risk_score: number;
  assigned_to: string | null;
  resolution_type: ResolutionType | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Fraud Alert Evidence ──
export interface DbFraudAlertEvidence {
  id: string;
  fraud_alert_id: string;
  file_path: string;
  file_type: string;
  file_name: string;
  notes: string | null;
  created_at: string;
}

// ── Emergency Lockdowns (replaces legacy PanicEvents) ──
export type LockdownTrigger = 'manual' | 'velocity_rule' | 'geo_anomaly' | 'failed_auth';

export interface DbEmergencyLockdown {
  id: string;
  user_id: string;
  device_id: string | null;
  trigger_type: LockdownTrigger;
  latitude: number | null;
  longitude: number | null;
  cards_frozen: boolean;
  wallet_frozen: boolean;
  p2p_disabled: boolean;
  is_resolved: boolean;
  resolved_by: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

// ── Wallet Freezes (replaces legacy CampusRestrictions) ──
export type FreezeScope = 'full' | 'card_only' | 'p2p_only' | 'withdrawal_only';
export type FreezeStatus = 'frozen' | 'active' | 'pending_unfreeze';

export interface DbWalletFreeze {
  id: string;
  user_id: string;
  fraud_alert_id: string | null;
  emergency_lockdown_id: string | null;
  scope: FreezeScope;
  status: FreezeStatus;
  is_manual_override: boolean;
  action_by: string | null;
  reason: string | null;
  frozen_at: string | null;
  unfrozen_at: string | null;
  created_at: string;
}

// ── Alert Actions (replaces legacy TriageActions) ──
export type AlertActionType =
  | 'assigned' | 'escalated' | 'contacted_user'
  | 'freeze_wallet' | 'unfreeze_wallet'
  | 'refund_initiated' | 'chargeback_filed'
  | 'resolved' | 'closed';

export interface DbAlertAction {
  id: string;
  fraud_alert_id: string;
  user_id: string;
  action: AlertActionType;
  notes: string | null;
  created_at: string;
}

// ── Notifications ──
export type NotificationType = 'transaction' | 'security' | 'system' | 'promotion';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface DbNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// ── Audit Logs ──
export interface DbAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
