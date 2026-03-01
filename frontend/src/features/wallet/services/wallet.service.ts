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

export type GetTransactionsResult = {
  items: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
};

export const walletService = {
  async getBalance(): Promise<{ amount: number }> {
    return api<{ amount: number }>("/api/wallet/balance");
  },

  async getTransactions(options?: { page?: number; limit?: number }): Promise<GetTransactionsResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 8;
    const res = await api<GetTransactionsResult>(
      `/api/wallet/transactions?page=${page}&limit=${limit}`
    );
    return res ?? { items: [], total: 0, page: 1, limit: 8 };
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
