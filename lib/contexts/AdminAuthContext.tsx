'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUsername: string | null;
  adminRole: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'c21_admin_token';
const AUTH_USER_KEY = 'c21_admin_user';
const AUTH_ROLE_KEY = 'c21_admin_role';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(AUTH_USER_KEY);
    const role = localStorage.getItem(AUTH_ROLE_KEY);

    if (token && user) {
      setIsAuthenticated(true);
      setAdminUsername(user);
      setAdminRole(role);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Invalid credentials');
    }

    const { token, username: user, role } = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, user);
    localStorage.setItem(AUTH_ROLE_KEY, role);
    setIsAuthenticated(true);
    setAdminUsername(user);
    setAdminRole(role);
  };

  const logout = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    setIsAuthenticated(false);
    setAdminUsername(null);
    setAdminRole(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUsername, adminRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
