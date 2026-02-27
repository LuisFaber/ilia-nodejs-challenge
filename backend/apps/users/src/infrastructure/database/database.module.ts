import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepositoryMySQL } from "./user.repository.mysql";
import { BcryptPasswordHasher } from "../services/bcrypt-password-hasher";
import { PASSWORD_HASHER, USER_REPOSITORY } from "../../domain/ports";

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepositoryMySQL,
    BcryptPasswordHasher,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryMySQL,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [PrismaService, USER_REPOSITORY, PASSWORD_HASHER],
})
export class DatabaseModule {}

