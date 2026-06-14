import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await api.login(username, password);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login gagal.' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
