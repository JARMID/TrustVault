import { create } from 'zustand';

export interface VirtualCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  expiry: string;
  status: 'active' | 'frozen' | 'expired';
  label: string;
  color: string;
  /** Encrypted card number — decrypted only on client with user's private key */
  encryptedPan?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'p2p_in' | 'p2p_out';
  amount: number;
  currency: string;
  description: string;
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string;
}

interface WalletState {
  balance: number;
  currency: string;
  cards: VirtualCard[];
  recentTransactions: Transaction[];
  isLoadingBalance: boolean;

  // Actions
  setBalance: (balance: number) => void;
  setCards: (cards: VirtualCard[]) => void;
  addCard: (card: VirtualCard) => void;
  freezeCard: (cardId: string) => void;
  setTransactions: (txns: Transaction[]) => void;
  setLoadingBalance: (loading: boolean) => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  balance: 0,
  currency: 'DZD',
  cards: [],
  recentTransactions: [],
  isLoadingBalance: false,

  setBalance: (balance) => set({ balance }),
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  freezeCard: (cardId) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, status: 'frozen' as const } : c
      ),
    })),
  setTransactions: (recentTransactions) => set({ recentTransactions }),
  setLoadingBalance: (isLoadingBalance) => set({ isLoadingBalance }),
}));
