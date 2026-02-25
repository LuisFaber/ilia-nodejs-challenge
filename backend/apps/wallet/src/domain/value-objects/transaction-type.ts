const VALID_TYPES = ["CREDIT", "DEBIT"] as const;
export type TransactionTypeValue = (typeof VALID_TYPES)[number];

export class TransactionType {
  private readonly _value: TransactionTypeValue;

  private constructor(value: TransactionTypeValue) {
    this._value = value;
  }

  static create(value: string): TransactionType {
    const normalized = String(value).toUpperCase();
    if (normalized !== "CREDIT" && normalized !== "DEBIT") {
      throw new Error("Transaction type must be CREDIT or DEBIT");
    }
    return new TransactionType(normalized);
  }

  static credit(): TransactionType {
    return new TransactionType("CREDIT");
  }

  static debit(): TransactionType {
    return new TransactionType("DEBIT");
  }

  get value(): TransactionTypeValue {
    return this._value;
  }

  isCredit(): boolean {
    return this._value === "CREDIT";
  }

  isDebit(): boolean {
    return this._value === "DEBIT";
  }

  equals(other: TransactionType): boolean {
    return this._value === other._value;
  }
}
