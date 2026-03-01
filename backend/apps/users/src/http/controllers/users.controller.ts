import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { UserId } from "../decorators/user-id.decorator";
import { Public } from "../decorators/public.decorator";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

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
    const user = await this.createUser.run({
      firstName: dto.first_name,
      lastName: dto.last_name,
      email: dto.email,
      password: dto.password,
      language: dto.language,
    });
    return user.toJSON();
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getById(@Param("id") id: string, @UserId() userId: string) {
    if (id !== userId) {
      throw new ForbiddenException("Cannot access another user");
    }
    const user = await this.getUserById.run(id);
    return user.toJSON();
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user (first_name, last_name, email, password, language)" })
  @ApiResponse({ status: 200, description: "User updated" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id") id: string,
    @UserId() userId: string,
    @Body() dto: UpdateUserDto
  ) {
    if (id !== userId) {
      throw new ForbiddenException("Cannot update another user");
    }
    const user = await this.updateUser.run({
      id,
      firstName: dto.first_name,
      lastName: dto.last_name,
      email: dto.email,
      password: dto.password,
      language: dto.language,
    });
    return user.toJSON();
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 204, description: "User deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async delete(@Param("id") id: string, @UserId() userId: string) {
    if (id !== userId) {
      throw new ForbiddenException("Cannot delete another user");
    }
    await this.deleteUser.run(id);
  }
}

