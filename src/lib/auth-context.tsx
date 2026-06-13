'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Role } from './types';
import { findUserByEmail, createUser } from './store';

interface AuthContextValue {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('flowclass_session');
    if (raw) {
      try {
        const u = JSON.parse(raw) as User;
        setUser(u);
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, name: string) => {
    let u = findUserByEmail(email);
    const role: Role = email.includes('teacher') ? 'teacher' : 'student';
    if (!u) u = createUser(email, name, role);
    setUser(u);
    localStorage.setItem('flowclass_session', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('flowclass_session');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
