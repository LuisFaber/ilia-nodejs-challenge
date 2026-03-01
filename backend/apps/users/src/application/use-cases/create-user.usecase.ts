import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IPasswordHasher } from "../../domain/services";
import type { IUserRepository } from "../../domain/repositories";
import { Email } from "../../domain/value-objects";
import { PASSWORD_HASHER, USER_REPOSITORY } from "../../domain/ports";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  language?: "en" | "pt" | "es";
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async run(input: CreateUserInput): Promise<User> {
    const emailVo = Email.create(input.email);
    const existing = await this.userRepository.findByEmail(emailVo.value);
    if (existing !== null) {
      throw new DomainError("Email already registered");
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const language = (input.language ?? "en") as "en" | "pt" | "es";
    const now = new Date();
    const user = User.create({
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: emailVo,
      passwordHash,
      language,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.create(user);
  }
}
