export class Amount {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Amount {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new Error("Amount must be an integer");
    }
    if (parsed <= 0) {
      throw new Error("Amount must be positive");
    }
    return new Amount(parsed);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Amount): boolean {
    return this._value === other._value;
  }
}
