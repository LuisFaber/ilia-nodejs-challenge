import { Module } from "@nestjs/common";
import { DatabaseModule } from "../infrastructure/database/database.module";
import { CreateUserUseCase } from "./use-cases/create-user.usecase";
import { GetUserByIdUseCase } from "./use-cases/get-user-by-id.usecase";
import { UpdateUserUseCase } from "./use-cases/update-user.usecase";
import { DeleteUserUseCase } from "./use-cases/delete-user.usecase";
import { AuthenticateUserUseCase } from "./use-cases/authenticate-user.usecase";

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    AuthenticateUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    AuthenticateUserUseCase,
  ],
})
export class ApplicationModule {}
