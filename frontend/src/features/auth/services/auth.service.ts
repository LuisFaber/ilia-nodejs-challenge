/**
 * Auth service: all requests use credentials: "include".
 * JWT is stored only in httpOnly cookie (set by BFF or backend); never in localStorage.
 */

const getBase = () => (typeof window === "undefined" ? "" : "");

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  language?: "en" | "pt" | "es";
  created_at?: string;
  updated_at?: string;
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

async function api<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: object }
): Promise<T> {
  const { body, ...rest } = init ?? {};
  const res = await fetch(`${getBase()}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function apiNoBody(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(`${getBase()}${path}`, {
    ...init,
    credentials: "include",
    headers: { ...init?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Request failed");
  }
}

export type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  language?: "en" | "pt" | "es";
};

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User }> {
    return api<{ user: User }>("/api/auth/login", { method: "POST", body: payload });
  },

  async register(payload: RegisterPayload): Promise<{ user: User }> {
    return api<{ user: User }>("/api/auth/register", { method: "POST", body: payload });
  },

  async logout(): Promise<void> {
    await api("/api/auth/logout", { method: "POST" });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await api<User>("/api/auth/me", { method: "GET" });
      return user ?? null;
    } catch {
      return null;
    }
  },

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    const data = await api<User>(`/api/users/${userId}`, {
      method: "PATCH",
      body: payload,
    });
    return data as User;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiNoBody(`/api/users/${userId}`, { method: "DELETE" });
  },
};
