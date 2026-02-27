import { Inject, Injectable } from "@nestjs/common";
import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";
import { USER_REPOSITORY } from "../../domain/ports";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async run(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (existing === null) {
      throw new DomainError("User not found");
    }
    await this.userRepository.delete(id);
  }
}
