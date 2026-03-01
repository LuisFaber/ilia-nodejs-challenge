import { Amount } from "../value-objects/amount";
import { TransactionType } from "../value-objects/transaction-type";

const MAX_DESCRIPTION_LENGTH = 120;

export class Transaction {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _amount: Amount,
    private readonly _type: TransactionType,
    private readonly _description: string | undefined,
    private readonly _createdAt: Date
  ) {}

  static createCredit(
    id: string,
    userId: string,
    amount: Amount,
    description: string | undefined,
    createdAt: Date
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    const normalizedDescription = Transaction.normalizeDescription(description);
    Transaction.validateDescription(normalizedDescription);
    Transaction.validateCreatedAt(createdAt);
    return new Transaction(
      id,
      userId,
      amount,
      TransactionType.credit(),
      normalizedDescription,
      createdAt
    );
  }

  static createDebit(
    id: string,
    userId: string,
    amount: Amount,
    description: string | undefined,
    createdAt: Date,
    currentBalance: number
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    const normalizedDescription = Transaction.normalizeDescription(description);
    Transaction.validateDescription(normalizedDescription);
    Transaction.validateCreatedAt(createdAt);
    const type = TransactionType.debit();
    if (currentBalance < amount.value) {
      throw new Error("Insufficient balance for debit");
    }
    return new Transaction(id, userId, amount, type, normalizedDescription, createdAt);
  }

  static create(
    id: string,
    userId: string,
    amount: Amount,
    type: TransactionType,
    description: string | undefined,
    createdAt: Date,
    currentBalance: number
  ): Transaction {
    Transaction.validateId(id);
    Transaction.validateUserId(userId);
    const normalizedDescription = Transaction.normalizeDescription(description);
    Transaction.validateDescription(normalizedDescription);
    Transaction.validateCreatedAt(createdAt);
    if (type.isDebit() && currentBalance < amount.value) {
      throw new Error("Insufficient balance for debit");
    }
    return new Transaction(id, userId, amount, type, normalizedDescription, createdAt);
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

  private static normalizeDescription(description: string | undefined | null): string | undefined {
    if (description === undefined || description === null) return undefined;
    if (typeof description !== "string") return undefined;
    const trimmed = description.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }

  private static validateDescription(description: string | undefined): void {
    if (description === undefined) return;
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
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

  get description(): string | undefined {
    return this._description;
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
