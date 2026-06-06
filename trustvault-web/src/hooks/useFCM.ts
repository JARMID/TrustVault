import { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { useToast } from '../components/ui/Toast';

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Attempt to get token on mount
    const fetchToken = async () => {
      try {
        const token = await requestForToken();
        if (token) {
          setFcmToken(token);
          // Here we would typically send this token to our backend
          // await api.post('/users/fcm-token', { token });
        }
      } catch (err) {
        console.error('FCM Token generation failed:', err);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Set up foreground message listener
    const setupListener = async () => {
      try {
        const payload: any = await onMessageListener();
        console.log('[FCM] Foreground message received: ', payload);
        
        // Show toast notification
        if (payload?.notification) {
          addToast({
            title: payload.notification.title || 'New Notification',
            message: payload.notification.body || '',
            type: 'info'
          });
        }
        
        // Re-listen for the next message
        setupListener();
      } catch (err) {
        console.error('Failed to listen for FCM messages:', err);
      }
    };

    setupListener();
  }, [addToast]);

  return { fcmToken };
};
