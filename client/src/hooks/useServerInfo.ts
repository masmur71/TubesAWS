import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { ServerInfo } from '../types';

export function useServerInfo(pollInterval = 0) {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInfo = useCallback(async () => {
    try {
      const data = await api.getServerInfo();
      setServerInfo(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
    if (pollInterval > 0) {
      const interval = setInterval(fetchInfo, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchInfo, pollInterval]);

  return { serverInfo, loading };
}
