import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (existing === null) {
      throw new DomainError("User not found");
    }
    await this.userRepository.delete(id);
  }
}
