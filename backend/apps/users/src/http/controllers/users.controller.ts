import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from "../../application/use-cases";
import { DomainError } from "../../domain/errors";
import { UserId } from "../decorators/user-id.decorator";
import { Public } from "../decorators/public.decorator";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

function mapDomainError(err: unknown): never {
  if (err instanceof DomainError) {
    const msg = err.message.toLowerCase();
    if (msg.includes("not found")) throw new NotFoundException(err.message);
    if (msg.includes("already registered") || msg.includes("already exists")) {
      throw new ConflictException(err.message);
    }
  }
  throw err;
}

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Create user (public - registration)" })
  @ApiResponse({ status: 201, description: "User created" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.createUser.run({
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        password: dto.password,
        language: dto.language,
      });
      return user.toJSON();
    } catch (err) {
      mapDomainError(err);
    }
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getById(@Param("id") id: string, @UserId() userId: string) {
    if (id !== userId) throw new ForbiddenException("Cannot access another user");
    try {
      const user = await this.getUserById.run(id);
      return user.toJSON();
    } catch (err) {
      mapDomainError(err);
    }
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user (first_name, last_name, email, password, language)" })
  @ApiResponse({ status: 200, description: "User updated" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  async update(
    @Param("id") id: string,
    @UserId() userId: string,
    @Body() dto: UpdateUserDto
  ) {
    if (id !== userId) throw new ForbiddenException("Cannot update another user");
    try {
      const user = await this.updateUser.run({
        id,
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        password: dto.password,
        language: dto.language,
      });
      return user.toJSON();
    } catch (err) {
      mapDomainError(err);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 204, description: "User deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async delete(@Param("id") id: string, @UserId() userId: string) {
    if (id !== userId) throw new ForbiddenException("Cannot delete another user");
    try {
      await this.deleteUser.run(id);
    } catch (err) {
      mapDomainError(err);
    }
  }
}

