/** Generic API response wrapper */
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type BalanceResponse = {
  amount: number;
};

export type TransactionType = "credit" | "debit";

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  createdAt: string;
};
