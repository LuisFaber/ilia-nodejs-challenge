import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(input: UpdateUserInput): Promise<User> {
    const existing = await this.userRepository.findById(input.id);
    if (existing === null) {
      throw new DomainError("User not found");
    }

    const firstName = input.firstName?.trim() ?? existing.firstName;
    const lastName = input.lastName?.trim() ?? existing.lastName;
    const updatedAt = new Date();

    const updatedUser = User.create({
      id: existing.id,
      firstName,
      lastName,
      email: existing.email,
      passwordHash: existing.password,
      createdAt: existing.createdAt,
      updatedAt,
    });

    await this.userRepository.update(updatedUser);
    return updatedUser;
  }
}
