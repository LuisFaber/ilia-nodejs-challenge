export type {
  ITransactionContext,
  ITransactionRepository,
  FindByUserIdOptions,
  FindByUserIdResult,
} from "./transaction-repository.interface";

/** Injection token for ITransactionRepository (interfaces are not available at runtime). */
export const TRANSACTION_REPOSITORY = Symbol.for("ITransactionRepository");
