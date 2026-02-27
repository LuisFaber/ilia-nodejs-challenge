import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../domain/entities";
import { DomainError } from "../../domain/errors";
import type { IPasswordHasher } from "../../domain/services";
import type { IUserRepository } from "../../domain/repositories";
import { Email } from "../../domain/value-objects";
import { PASSWORD_HASHER, USER_REPOSITORY } from "../../domain/ports";

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserResult {
  user: User;
  payload: { sub: string; email: string };
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async run(input: AuthenticateUserInput): Promise<AuthenticateUserResult> {
    const emailVo = Email.create(input.email);
    const user = await this.userRepository.findByEmail(emailVo.value);
    if (user === null) {
      throw new DomainError("Invalid credentials");
    }

    const matches = await this.passwordHasher.compare(
      input.password,
      user.password
    );
    if (!matches) {
      throw new DomainError("Invalid credentials");
    }

    return {
      user,
      payload: {
        sub: user.id,
        email: user.email.value,
      },
    };
  }
}
