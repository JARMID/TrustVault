import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface CommunitySignal {
  id: number;
  user_id: string;
  type: 'suspicious_activity' | 'theft_spotted' | 'lost_device' | 'scam_attempt' | string;
  latitude: number;
  longitude: number;
  confidence_score: number;
  is_verified: boolean;
  is_false_positive: boolean;
  created_at: string;
}

export function useCommunitySignals() {
  const [signals, setSignals] = useState<CommunitySignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const response = await api.get('/community/signals');
        setSignals(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch community signals:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSignals();
    
    // Fallback polling since we don't have pusher set up in the frontend yet
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  return { signals, isLoading };
}
