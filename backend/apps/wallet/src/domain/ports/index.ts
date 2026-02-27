export type {
  ITransactionContext,
  ITransactionRepository,
} from "./transaction-repository.interface";

/** Injection token for ITransactionRepository (interfaces are not available at runtime). */
export const TRANSACTION_REPOSITORY = Symbol.for("ITransactionRepository");
