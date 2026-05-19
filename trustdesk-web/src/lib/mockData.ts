/**
 * TrustVault — Mock Data
 * Realistic mock data for development before Supabase is connected.
 */

import type { DbWallet, DbVirtualCard, DbTransaction, DbContact, DbNotification } from '../types/database';

// ── Wallets ──
export const mockWallets: DbWallet[] = [
  { id: 'w1', user_id: 'u1', name: 'Primary Account', type: 'checking', balance: 245_680, currency: 'DZD', is_primary: true, status: 'active', created_at: '2025-01-15T10:00:00Z' },
  { id: 'w2', user_id: 'u1', name: 'Savings Vault', type: 'savings', balance: 892_340, currency: 'DZD', is_primary: false, status: 'active', created_at: '2025-02-20T14:30:00Z' },
  { id: 'w3', user_id: 'u1', name: 'Investment Pool', type: 'investment', balance: 156_000, currency: 'DZD', is_primary: false, status: 'active', created_at: '2025-06-10T09:15:00Z' },
];

// ── Virtual Cards ──
export const mockCards: DbVirtualCard[] = [
  { id: 'c1', user_id: 'u1', wallet_id: 'w1', last4: '4829', brand: 'visa', expiry_month: 9, expiry_year: 2028, status: 'active', label: 'Daily Spending', color: '#0c2d3e', spending_limit: 50_000, spent_this_month: 32_450, created_at: '2025-03-01T08:00:00Z' },
  { id: 'c2', user_id: 'u1', wallet_id: 'w1', last4: '7153', brand: 'mastercard', expiry_month: 3, expiry_year: 2027, status: 'active', label: 'Online Shopping', color: '#1a1a2e', spending_limit: 100_000, spent_this_month: 18_200, created_at: '2025-04-15T12:00:00Z' },
  { id: 'c3', user_id: 'u1', wallet_id: 'w2', last4: '9021', brand: 'visa', expiry_month: 12, expiry_year: 2029, status: 'frozen', label: 'Travel Card', color: '#0a192f', spending_limit: null, spent_this_month: 0, created_at: '2025-07-20T16:30:00Z' },
];

// ── Transactions ──
export const mockTransactions: DbTransaction[] = [
  { id: 'txn-001', user_id: 'u1', wallet_id: 'w1', card_id: 'c1', type: 'debit', amount: -2_500, currency: 'DZD', description: 'P2P Transfer', category: 'transfer', counterparty: 'Ahmed B.', counterparty_avatar: null, reference: 'TXN-8401', status: 'completed', metadata: null, created_at: '2026-05-12T04:35:00Z' },
  { id: 'txn-002', user_id: 'u1', wallet_id: 'w1', card_id: 'c1', type: 'debit', amount: -8_750, currency: 'DZD', description: 'Card Payment — Carrefour Alger', category: 'shopping', counterparty: 'Carrefour Alger', counterparty_avatar: null, reference: 'TXN-8400', status: 'completed', metadata: null, created_at: '2026-05-12T04:20:00Z' },
  { id: 'txn-003', user_id: 'u1', wallet_id: 'w1', card_id: null, type: 'credit', amount: 145_000, currency: 'DZD', description: 'Salary Deposit', category: 'salary', counterparty: 'BEYN Corp', counterparty_avatar: null, reference: 'TXN-8399', status: 'completed', metadata: null, created_at: '2026-05-12T02:00:00Z' },
  { id: 'txn-004', user_id: 'u1', wallet_id: 'w1', card_id: null, type: 'debit', amount: -3_200, currency: 'DZD', description: 'Bill Payment — Algérie Télécom', category: 'utilities', counterparty: 'Algérie Télécom', counterparty_avatar: null, reference: 'TXN-8398', status: 'completed', metadata: null, created_at: '2026-05-11T23:00:00Z' },
  { id: 'txn-005', user_id: 'u1', wallet_id: 'w1', card_id: 'c2', type: 'refund', amount: 4_500, currency: 'DZD', description: 'Refund — Jumia DZ', category: 'shopping', counterparty: 'Jumia DZ', counterparty_avatar: null, reference: 'TXN-8397', status: 'pending', metadata: null, created_at: '2026-05-11T10:00:00Z' },
  { id: 'txn-006', user_id: 'u1', wallet_id: 'w1', card_id: null, type: 'withdrawal', amount: -10_000, currency: 'DZD', description: 'ATM Withdrawal', category: 'other', counterparty: 'CPA ATM #442', counterparty_avatar: null, reference: 'TXN-8396', status: 'completed', metadata: null, created_at: '2026-05-11T08:00:00Z' },
  { id: 'txn-007', user_id: 'u1', wallet_id: 'w1', card_id: 'c1', type: 'debit', amount: -1_800, currency: 'DZD', description: 'Uber Ride', category: 'transport', counterparty: 'Yassir', counterparty_avatar: null, reference: 'TXN-8395', status: 'completed', metadata: null, created_at: '2026-05-10T22:00:00Z' },
  { id: 'txn-008', user_id: 'u1', wallet_id: 'w1', card_id: 'c1', type: 'debit', amount: -4_200, currency: 'DZD', description: 'Restaurant — El Djazair', category: 'food', counterparty: 'El Djazair Restaurant', counterparty_avatar: null, reference: 'TXN-8394', status: 'completed', metadata: null, created_at: '2026-05-10T20:30:00Z' },
  { id: 'txn-009', user_id: 'u1', wallet_id: 'w2', card_id: null, type: 'credit', amount: 50_000, currency: 'DZD', description: 'Savings Transfer', category: 'transfer', counterparty: 'Self — Checking', counterparty_avatar: null, reference: 'TXN-8393', status: 'completed', metadata: null, created_at: '2026-05-10T12:00:00Z' },
  { id: 'txn-010', user_id: 'u1', wallet_id: 'w1', card_id: 'c2', type: 'debit', amount: -15_900, currency: 'DZD', description: 'Amazon.com Purchase', category: 'shopping', counterparty: 'Amazon', counterparty_avatar: null, reference: 'TXN-8392', status: 'completed', metadata: null, created_at: '2026-05-09T15:00:00Z' },
  { id: 'txn-011', user_id: 'u1', wallet_id: 'w1', card_id: null, type: 'debit', amount: -7_500, currency: 'DZD', description: 'Electricity Bill', category: 'utilities', counterparty: 'Sonelgaz', counterparty_avatar: null, reference: 'TXN-8391', status: 'completed', metadata: null, created_at: '2026-05-09T10:00:00Z' },
  { id: 'txn-012', user_id: 'u1', wallet_id: 'w1', card_id: 'c1', type: 'debit', amount: -2_100, currency: 'DZD', description: 'Pharmacy', category: 'health', counterparty: 'Pharmacie Centrale', counterparty_avatar: null, reference: 'TXN-8390', status: 'completed', metadata: null, created_at: '2026-05-08T14:00:00Z' },
];

// ── Contacts ──
export const mockContacts: DbContact[] = [
  { id: 'ct1', user_id: 'u1', name: 'Ahmed Benali', email: 'ahmed.b@email.com', phone: '+213 555 1234', avatar_url: null, is_favorite: true, last_transfer_at: '2026-05-12T04:35:00Z', created_at: '2025-01-10T08:00:00Z' },
  { id: 'ct2', user_id: 'u1', name: 'Fatima Zahra', email: 'fatima.z@email.com', phone: '+213 555 5678', avatar_url: null, is_favorite: true, last_transfer_at: '2026-05-08T11:00:00Z', created_at: '2025-02-14T10:00:00Z' },
  { id: 'ct3', user_id: 'u1', name: 'Youssef Kaci', email: 'youssef.k@email.com', phone: '+213 555 9012', avatar_url: null, is_favorite: false, last_transfer_at: '2026-04-20T09:00:00Z', created_at: '2025-03-22T15:00:00Z' },
  { id: 'ct4', user_id: 'u1', name: 'Amina Hadj', email: 'amina.h@email.com', phone: '+213 555 3456', avatar_url: null, is_favorite: false, last_transfer_at: '2026-03-15T16:00:00Z', created_at: '2025-05-01T12:00:00Z' },
  { id: 'ct5', user_id: 'u1', name: 'Karim Medjdoub', email: 'karim.m@email.com', phone: '+213 555 7890', avatar_url: null, is_favorite: true, last_transfer_at: '2026-05-10T19:00:00Z', created_at: '2025-06-18T08:00:00Z' },
];

// ── Notifications ──
export const mockNotifications: DbNotification[] = [
  { id: 'n1', user_id: 'u1', type: 'transaction', priority: 'medium', title: 'Payment Received', message: 'You received 145,000 DZD from BEYN Corp (Salary)', is_read: false, action_url: '/app/wallet', created_at: '2026-05-12T02:00:00Z' },
  { id: 'n2', user_id: 'u1', type: 'security', priority: 'high', title: 'New Device Login', message: 'A new device logged into your account from Algiers, DZ.', is_read: false, action_url: '/app/security', created_at: '2026-05-11T23:45:00Z' },
  { id: 'n3', user_id: 'u1', type: 'transaction', priority: 'low', title: 'Refund Processing', message: 'Your refund of 4,500 DZD from Jumia DZ is being processed.', is_read: true, action_url: '/app/wallet', created_at: '2026-05-11T10:00:00Z' },
  { id: 'n4', user_id: 'u1', type: 'system', priority: 'low', title: 'App Update Available', message: 'TrustVault v2.4.0 is now available with new features.', is_read: true, action_url: null, created_at: '2026-05-10T08:00:00Z' },
  { id: 'n5', user_id: 'u1', type: 'security', priority: 'critical', title: 'Suspicious Transaction Blocked', message: 'A 250,000 DZD transfer attempt was blocked by AI fraud detection.', is_read: false, action_url: '/app/security', created_at: '2026-05-09T16:20:00Z' },
];

// ── Analytics helpers ──
export const mockSpendingByCategory = [
  { category: 'Shopping', amount: 38_850, percentage: 31, color: '#818CF8' },
  { category: 'Transport', amount: 12_400, percentage: 10, color: '#00C6AE' },
  { category: 'Food', amount: 22_600, percentage: 18, color: '#F59E0B' },
  { category: 'Utilities', amount: 10_700, percentage: 9, color: '#EF4444' },
  { category: 'Health', amount: 5_200, percentage: 4, color: '#10B981' },
  { category: 'Transfer', amount: 34_500, percentage: 28, color: '#A78BFA' },
];

export const mockMonthlyFlow = [
  { month: 'Jan', income: 145_000, expenses: 98_400 },
  { month: 'Feb', income: 145_000, expenses: 112_600 },
  { month: 'Mar', income: 152_000, expenses: 89_200 },
  { month: 'Apr', income: 145_000, expenses: 105_800 },
  { month: 'May', income: 190_000, expenses: 78_300 },
];

