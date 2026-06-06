import { create } from 'zustand';
import { supabase, isSupabaseReady } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';


export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'client' | 'admin' | 'fraud_analyst' | 'compliance_officer';
  kyc_status: 'pending' | 'verified' | 'rejected';
}

interface AuthState {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

async function fetchProfile(userId: string, set: (partial: Partial<AuthState>) => void) {
  if (!isSupabaseReady() || !supabase) {
    set({ isLoading: false });
    return;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!error && data) {
    set({ profile: data as UserProfile, isLoading: false });
  } else {
    set({ isLoading: false });
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (!isSupabaseReady() || !supabase) {
      set({ isLoading: false });
      return;
    }

    // Get current session on init
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isAuthenticated: !!session });
      if (session?.user) {
        fetchProfile(session.user.id, set);
      } else {
        set({ isLoading: false });
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isAuthenticated: !!session });
      if (session?.user) {
        fetchProfile(session.user.id, set);
      } else {
        set({ profile: null, isLoading: false });
      }
    });
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null, profile: null, session: null, isAuthenticated: false });
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    set((state) => {
      if (!state.profile) return state;
      return { profile: { ...state.profile, ...updates } };
    });

    const { user } = useAuthStore.getState();
    if (user && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        console.error("Failed to update profile", error);
      }
    }
  },
}));
