import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockWallets, mockCards, mockTransactions } from '../lib/mockData';
import type { DbWallet, DbVirtualCard, DbTransaction } from '../types/database';

interface WalletHookReturn {
  wallets: DbWallet[];
  cards: DbVirtualCard[];
  transactions: DbTransaction[];
  totalBalance: number;
  primaryWallet: DbWallet | null;
  isLoading: boolean;
  // Card actions
  freezeCard: (cardId: string) => void;
  unfreezeCard: (cardId: string) => void;
  // Transaction filters
  filterTransactions: (filters: TransactionFilters) => DbTransaction[];
}

export interface TransactionFilters {
  type?: DbTransaction['type'];
  status?: DbTransaction['status'];
  category?: DbTransaction['category'];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  walletId?: string;
}

export function useWallet(): WalletHookReturn {
  const [wallets, setWallets] = useState<DbWallet[]>(mockWallets);
  const [cards, setCards] = useState<DbVirtualCard[]>(mockCards);
  const [transactions, setTransactions] = useState<DbTransaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseReady()) return;
      setIsLoading(true);
      try {
        const [walletsRes, cardsRes, txRes] = await Promise.all([
          supabase!.from('wallets').select('*').order('created_at', { ascending: false }),
          supabase!.from('virtual_cards').select('*').order('created_at', { ascending: false }),
          supabase!.from('transactions').select('*').order('created_at', { ascending: false })
        ]);

        if (walletsRes.data && walletsRes.data.length > 0) setWallets(walletsRes.data as DbWallet[]);
        if (cardsRes.data && cardsRes.data.length > 0) setCards(cardsRes.data as DbVirtualCard[]);
        if (txRes.data && txRes.data.length > 0) setTransactions(txRes.data as DbTransaction[]);
      } catch (error) {
        console.error('Error fetching wallet data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const totalBalance = wallets
    .filter((w) => w.status === 'active')
    .reduce((sum, w) => sum + w.balance, 0);

  const primaryWallet = wallets.find((w) => w.is_primary) ?? null;

  const freezeCard = useCallback(async (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: 'frozen' as const } : c))
    );
    if (isSupabaseReady()) {
      await supabase!.from('virtual_cards').update({ status: 'frozen' }).eq('id', cardId);
    }
  }, []);

  const unfreezeCard = useCallback(async (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: 'active' as const } : c))
    );
    if (isSupabaseReady()) {
      await supabase!.from('virtual_cards').update({ status: 'active' }).eq('id', cardId);
    }
  }, []);

  const filterTransactions = useCallback(
    (filters: TransactionFilters): DbTransaction[] => {
      let result = [...transactions];

      if (filters.type) result = result.filter((t) => t.type === filters.type);
      if (filters.status) result = result.filter((t) => t.status === filters.status);
      if (filters.category) result = result.filter((t) => t.category === filters.category);
      if (filters.walletId) result = result.filter((t) => t.wallet_id === filters.walletId);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            t.counterparty?.toLowerCase().includes(q) ||
            t.reference.toLowerCase().includes(q)
        );
      }
      if (filters.dateFrom) {
        result = result.filter((t) => t.created_at >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        result = result.filter((t) => t.created_at <= filters.dateTo!);
      }

      return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    [transactions]
  );

  return {
    wallets,
    cards,
    transactions,
    totalBalance,
    primaryWallet,
    isLoading,
    freezeCard,
    unfreezeCard,
    filterTransactions,
  };
}
