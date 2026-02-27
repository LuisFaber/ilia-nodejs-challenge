import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new DomainError("User not found");
    }
    return user;
  }
}
