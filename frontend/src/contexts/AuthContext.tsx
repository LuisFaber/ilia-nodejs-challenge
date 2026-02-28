"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/auth";
import { getToken, setToken as setTokenStorage, clearToken } from "@/services/auth/token";

const USER_KEY = "auth_user";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(USER_KEY);
}

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    const u = getStoredUser();
    if (t) setTokenState(t);
    if (u) setUserState(u);
  }, []);

  const login = useCallback((u: User, t: string) => {
    setTokenStorage(t);
    setStoredUser(u);
    setUserState(u);
    setTokenState(t);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setStoredUser(null);
    setUserState(null);
    setTokenState(null);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setStoredUser(u);
    setUserState(u);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout, setUser }),
    [user, token, login, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
