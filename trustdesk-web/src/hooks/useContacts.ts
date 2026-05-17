import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockContacts } from '../lib/mockData';
import type { DbContact } from '../types/database';

interface ContactsHookReturn {
  contacts: DbContact[];
  isLoading: boolean;
  addContact: (contact: Partial<DbContact>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
}

export function useContacts(): ContactsHookReturn {
  const [contacts, setContacts] = useState<DbContact[]>(mockContacts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseReady()) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase!
          .from('contacts')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) throw error;
        if (data && data.length > 0) {
          setContacts(data as DbContact[]);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const addContact = useCallback(async (contact: Partial<DbContact>) => {
    if (!isSupabaseReady()) return;
    try {
      const { data, error } = await supabase!
        .from('contacts')
        .insert(contact)
        .select()
        .single();
        
      if (error) throw error;
      if (data) {
        setContacts(prev => [...prev, data as DbContact].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }, []);

  const removeContact = useCallback(async (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    if (!isSupabaseReady()) return;
    try {
      const { error } = await supabase!.from('contacts').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing contact:', error);
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string, isFavorite: boolean) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, is_favorite: isFavorite } : c));
    if (!isSupabaseReady()) return;
    try {
      const { error } = await supabase!.from('contacts').update({ is_favorite: isFavorite }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }, []);

  return { contacts, isLoading, addContact, removeContact, toggleFavorite };
}
