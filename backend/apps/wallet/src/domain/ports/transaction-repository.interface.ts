import { Transaction } from "../entities/transaction";

export interface ITransactionContext {
  getBalanceLocked(userId: string): Promise<number>;
  save(transaction: Transaction): Promise<void>;
}

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findByUserId(userId: string): Promise<Transaction[]>;
  getBalance(userId: string): Promise<number>;
  runInTransaction<T>(fn: (ctx: ITransactionContext) => Promise<T>): Promise<T>;
}
