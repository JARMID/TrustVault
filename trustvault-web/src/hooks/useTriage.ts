import { useState, useEffect } from 'react';
import api from '../lib/api';
import { type DbFraudAlert } from '../types/database';

export function useTriage() {
  const [alerts, setAlerts] = useState<DbFraudAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/fraud-alerts');
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch fraud alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const takeAction = async (id: string, action: string) => {
    try {
      // Mock action logic since normal users can't trigger agent endpoints unless authorized.
      // We'll update state optimistically.
      setAlerts(prev => prev.map(a => {
        if (a.id === id) {
          if (action === 'claim') return { ...a, status: 'investigating', assigned_to: 'You' };
          if (action === 'resolve') return { ...a, status: 'resolved' };
          if (action === 'escalate') return { ...a, status: 'escalated' };
        }
        return a;
      }));
      // Actually try to hit the update endpoint if owner
      await api.put(`/fraud-alerts/${id}`, {
        status: action === 'resolve' ? 'resolved' : action === 'claim' ? 'investigating' : 'escalated'
      });
    } catch (e) {
      console.error('Failed action:', e);
    }
  };

  return {
    alerts,
    loading,
    takeAction
  };
}
