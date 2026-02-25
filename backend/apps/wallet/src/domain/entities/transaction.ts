import { Amount } from "../value-objects/amount";
import { TransactionType } from "../value-objects/transaction-type";

export class Transaction {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _amount: Amount,
    private readonly _type: TransactionType,
    private readonly _createdAt: Date
  ) {}

  static createCredit(
    id: string,
    userId: string,
    amount: Amount,
    createdAt: Date
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    Transaction.validateCreatedAt(createdAt);
    return new Transaction(id, userId, amount, TransactionType.credit(), createdAt);
  }

  static createDebit(
    id: string,
    userId: string,
    amount: Amount,
    createdAt: Date,
    currentBalance: number
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    Transaction.validateCreatedAt(createdAt);
    const type = TransactionType.debit();
    if (currentBalance < amount.value) {
      throw new Error("Insufficient balance for debit");
    }
    return new Transaction(id, userId, amount, type, createdAt);
  }

  static create(
    id: string,
    userId: string,
    amount: Amount,
    type: TransactionType,
    createdAt: Date,
    currentBalance: number
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    Transaction.validateCreatedAt(createdAt);
    if (type.isDebit() && currentBalance < amount.value) {
      throw new Error("Insufficient balance for debit");
    }
    return new Transaction(id, userId, amount, type, createdAt);
  }

  private static validateId(id: string): void {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Transaction id must be a non-empty string");
    }
  }

  private static validateUserId(userId: string): void {
    if (typeof userId !== "string" || userId.trim().length === 0) {
      throw new Error("User id must be a non-empty string");
    }
  }

  private static validateCreatedAt(createdAt: Date): void {
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      throw new Error("CreatedAt must be a valid date");
    }
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): Amount {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  isCredit(): boolean {
    return this._type.isCredit();
  }

  isDebit(): boolean {
    return this._type.isDebit();
  }

  signedAmount(): number {
    return this._type.isCredit() ? this._amount.value : -this._amount.value;
  }
}
