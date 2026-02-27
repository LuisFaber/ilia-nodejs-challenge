import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IUserRepository } from "../../domain/repositories";
import { USER_REPOSITORY } from "../../domain/ports";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async run(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new DomainError("User not found");
    }
    return user;
  }
}
