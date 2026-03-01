import { Transaction } from "../entities/transaction";

export interface ITransactionContext {
  getBalanceLocked(userId: string): Promise<number>;
  save(transaction: Transaction): Promise<void>;
}

export interface FindByUserIdOptions {
  page: number;
  limit: number;
}

export interface FindByUserIdResult {
  items: Transaction[];
  total: number;
}

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findByUserId(userId: string, options?: FindByUserIdOptions): Promise<FindByUserIdResult>;
  getBalance(userId: string): Promise<number>;
  runInTransaction<T>(fn: (ctx: ITransactionContext) => Promise<T>): Promise<T>;
}
