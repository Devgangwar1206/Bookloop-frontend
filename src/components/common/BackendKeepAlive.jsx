import { useEffect, useRef } from 'react';
import { healthApi } from '../../services/healthApi';

const TEN_MINUTES_MS = 10 * 60 * 1000; // 10 minutes interval (Render free tier sleeps after 15 min)

/**
 * BackendKeepAlive Component
 * 
 * Automatically sends lightweight keep-alive pings to backend /api/v1/health every 10 minutes.
 * This prevents Render free-tier web services from entering sleep mode and avoids
 * 50+ second cold-start delays for users.
 * 
 * Has zero UI footprint (returns null) and operates fully in the background.
 */
export function BackendKeepAlive() {
  const lastPingTimeRef = useRef(Date.now());

  useEffect(() => {
    // 1. Initial wake-up ping when frontend loads
    healthApi.ping().then(() => {
      lastPingTimeRef.current = Date.now();
    });

    // 2. Periodic background ping every 10 minutes
    const intervalId = setInterval(() => {
      healthApi.ping().then(() => {
        lastPingTimeRef.current = Date.now();
      });
    }, TEN_MINUTES_MS);

    // 3. Page visibility change handler
    // If user returns to the tab after 10+ minutes, ping immediately to warm backend
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastPing = Date.now() - lastPingTimeRef.current;
        if (timeSinceLastPing >= TEN_MINUTES_MS) {
          healthApi.ping().then(() => {
            lastPingTimeRef.current = Date.now();
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}

export default BackendKeepAlive;
