import { useState, useEffect } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import type { DbAuditLog } from '../types/database';

export function useAuditLogs(limit: number = 20) {
  const [logs, setLogs] = useState<DbAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!isSupabaseReady()) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase!
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data) {
          setLogs(data as DbAuditLog[]);
        }
      } catch (e) {
        console.error('Failed to fetch audit logs:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();

    // ── Real-time subscription ─────────────────────────────────────────────
    if (!isSupabaseReady()) return;

    const channel = supabase!
      .channel('audit-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs((prev) => [payload.new as DbAuditLog, ...prev].slice(0, limit));
      })
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [limit]);

  return { logs, isLoading };
}
