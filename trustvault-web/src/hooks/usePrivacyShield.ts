import { useEffect, useState } from 'react';

/**
 * Advanced Privacy Shield (Anti-Shoulder Surfing & Background Capture Protection)
 * 
 * Automatically obscures the application state when the user switches tabs, 
 * minimizes the window, or leaves the device idle.
 */
export const usePrivacyShield = (idleTimeoutMs: number = 60000) => {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [shieldReason, setShieldReason] = useState<'blur' | 'idle' | null>(null);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (shieldReason === 'idle') {
        setIsShieldActive(false);
        setShieldReason(null);
      }
      idleTimer = setTimeout(() => {
        setIsShieldActive(true);
        setShieldReason('idle');
      }, idleTimeoutMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
        setShieldReason('blur');
      } else {
        // Only unshield if it was caused by blur. If it was idle, require interaction.
        if (shieldReason === 'blur' || shieldReason === null) {
          setIsShieldActive(false);
          setShieldReason(null);
        }
      }
    };

    const handleWindowBlur = () => {
      setIsShieldActive(true);
      setShieldReason('blur');
    };

    const handleWindowFocus = () => {
      if (shieldReason === 'blur') {
        setIsShieldActive(false);
        setShieldReason(null);
      }
    };

    // Attach listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    // Idle listeners
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    // Initial timer
    resetIdleTimer();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [idleTimeoutMs, shieldReason]);

  return { isShieldActive, shieldReason };
};
