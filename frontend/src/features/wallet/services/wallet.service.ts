const getBase = () => (typeof window === "undefined" ? "" : "");

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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { message?: string }).message ?? "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export type WalletTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description?: string;
  createdAt: string;
};

export const walletService = {
  async getBalance(): Promise<{ amount: number }> {
    return api<{ amount: number }>("/api/wallet/balance");
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    return api<WalletTransaction[]>("/api/wallet/transactions");
  },

  async createTransaction(params: {
    amount: number;
    type: "credit" | "debit";
    description?: string;
  }): Promise<WalletTransaction> {
    return api<WalletTransaction>("/api/wallet/transactions", {
      method: "POST",
      body: params,
    });
  },
};
