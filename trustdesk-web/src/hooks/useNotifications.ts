import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockNotifications } from '../lib/mockData';
import type { DbNotification } from '../types/database';

interface NotificationsHookReturn {
  notifications: DbNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  getByPriority: (priority: DbNotification['priority']) => DbNotification[];
}

export function useNotifications(): NotificationsHookReturn {
  const [notifications, setNotifications] = useState<DbNotification[]>(mockNotifications);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseReady()) return;
      try {
        const { data, error } = await supabase!
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) setNotifications(data as DbNotification[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    fetchData();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    if (isSupabaseReady()) {
      await supabase!.from('notifications').update({ is_read: true }).eq('id', id);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (isSupabaseReady()) {
      // Typically, you'd only want to update the ones for the current user
      await supabase!.from('notifications').update({ is_read: true }).eq('is_read', false);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (isSupabaseReady()) {
      await supabase!.from('notifications').delete().eq('id', id);
    }
  }, []);

  const getByPriority = useCallback(
    (priority: DbNotification['priority']) =>
      notifications.filter((n) => n.priority === priority),
    [notifications]
  );

  return { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, getByPriority };
}
