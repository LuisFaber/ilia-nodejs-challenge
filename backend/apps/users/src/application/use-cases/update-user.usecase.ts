import { Inject, Injectable } from "@nestjs/common";
import { User, type UserLanguage } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";
import type { IPasswordHasher } from "../../domain/services";
import { PASSWORD_HASHER, USER_REPOSITORY } from "../../domain/ports";
import { Email } from "../../domain/value-objects";

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  language?: UserLanguage;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async run(input: UpdateUserInput): Promise<User> {
    const existing = await this.userRepository.findById(input.id);
    if (existing === null) {
      throw new DomainError("User not found");
    }

    const firstName = input.firstName?.trim() ?? existing.firstName;
    const lastName = input.lastName?.trim() ?? existing.lastName;
    const language = input.language ?? existing.language;

    let email = existing.email;
    if (input.email !== undefined && input.email.trim() !== "") {
      const newEmail = Email.create(input.email.trim());
      const other = await this.userRepository.findByEmail(newEmail.value);
      if (other !== null && other.id !== existing.id) {
        throw new DomainError("Email already registered");
      }
      email = newEmail;
    }

    let passwordHash = existing.password;
    if (input.password !== undefined && input.password.length > 0) {
      passwordHash = await this.passwordHasher.hash(input.password);
    }

    const updatedAt = new Date();

    const updatedUser = User.create({
      id: existing.id,
      firstName,
      lastName,
      email,
      passwordHash,
      language,
      createdAt: existing.createdAt,
      updatedAt,
    });

    await this.userRepository.update(updatedUser);
    return updatedUser;
  }
}
