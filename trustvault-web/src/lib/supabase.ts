import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseReady = () => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://mock-placeholder.supabase.co';
};

// Initialize the Supabase client
export const supabase = isSupabaseReady() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
