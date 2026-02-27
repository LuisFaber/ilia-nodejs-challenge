import { DomainError } from "../errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _email: string,
    private readonly _password: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  static create(params: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    User.validateId(params.id);
    User.validateFirstName(params.firstName);
    User.validateLastName(params.lastName);
    User.validateEmail(params.email);
    User.validatePasswordHash(params.passwordHash);
    User.validateDate("createdAt", params.createdAt);
    User.validateDate("updatedAt", params.updatedAt);

    return new User(
      params.id,
      params.firstName.trim(),
      params.lastName.trim(),
      params.email.trim().toLowerCase(),
      params.passwordHash,
      params.createdAt,
      params.updatedAt
    );
  }

  private static validateId(id: string): void {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new DomainError("User id must be a non-empty string");
    }
  }

  private static validateFirstName(firstName: string): void {
    if (typeof firstName !== "string" || firstName.trim().length === 0) {
      throw new DomainError("First name must be a non-empty string");
    }
  }

  private static validateLastName(lastName: string): void {
    if (typeof lastName !== "string" || lastName.trim().length === 0) {
      throw new DomainError("Last name must be a non-empty string");
    }
  }

  private static validateEmail(email: string): void {
    if (typeof email !== "string" || email.trim().length === 0) {
      throw new DomainError("Email must be a non-empty string");
    }
    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      throw new DomainError("Email must have a valid format");
    }
  }

  private static validatePasswordHash(passwordHash: string): void {
    if (typeof passwordHash !== "string" || passwordHash.length === 0) {
      throw new DomainError("Password hash cannot be empty");
    }
  }

  private static validateDate(field: string, value: unknown): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new DomainError(`${field} must be a valid date`);
    }
  }

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt.getTime());
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      first_name: this._firstName,
      last_name: this._lastName,
      email: this._email,
      created_at: this._createdAt.toISOString(),
      updated_at: this._updatedAt.toISOString(),
    };
  }
}
