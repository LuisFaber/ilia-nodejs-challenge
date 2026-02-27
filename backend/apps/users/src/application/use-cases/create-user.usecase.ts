import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IPasswordHasher } from "../../domain/services";
import type { IUserRepository } from "../../domain/repositories";
import { Email } from "../../domain/value-objects";
import { randomUUID } from "node:crypto";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async run(input: CreateUserInput): Promise<User> {
    const emailVo = Email.create(input.email);
    const existing = await this.userRepository.findByEmail(emailVo.value);
    if (existing !== null) {
      throw new DomainError("Email already registered");
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const now = new Date();
    const user = User.create({
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: emailVo,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.create(user);
  }
}
