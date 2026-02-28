"use client";

import { useCallback } from "react";
import { getToken, setToken as setTokenStorage, clearToken } from "@/services/auth/token";

export function useToken() {
  const token = typeof window !== "undefined" ? getToken() : null;

  const setToken = useCallback((value: string) => {
    setTokenStorage(value);
  }, []);

  const removeToken = useCallback(() => {
    clearToken();
  }, []);

  return { token, setToken, removeToken };
}
