'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, usersApi } from '@/lib/api/auth';
import { clearStoredTokens, setStoredTokens } from '@/lib/api/client';
import type { LoginData, RegisterData } from '@/lib/api/auth';
import type { User } from '@/lib/types';
import { extractErrorMessage } from '@/lib/api/client';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
      clearStoredTokens();
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await refreshProfile();
      }
      setIsLoading(false);
    };
    init();

    const handleLogout = () => {
      setUser(null);
      clearStoredTokens();
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [refreshProfile]);

  const login = useCallback(async (data: LoginData) => {
    const response = await authApi.login(data);
    setStoredTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authApi.register(data);
    setStoredTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    } finally {
      clearStoredTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export { extractErrorMessage };
