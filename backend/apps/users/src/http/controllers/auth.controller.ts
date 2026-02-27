import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { AuthenticateUserUseCase } from "../../application/use-cases";
import type { JwtPayload } from "../strategies/jwt.strategy";
import { LoginDto } from "../dto/login.dto";
import { Public } from "../decorators/public.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authenticateUser: AuthenticateUserUseCase,
    private readonly jwtService: JwtService
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Authenticate and get access token" })
  @ApiResponse({ status: 200, description: "Returns user and access_token" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() dto: LoginDto) {
    const result = await this.authenticateUser.run({
      email: dto.email,
      password: dto.password,
    });
    const payload: JwtPayload = {
      sub: result.payload.sub,
      email: result.payload.email,
    };
    const access_token = this.jwtService.sign(payload);
    const userJson = result.user.toJSON();
    return {
      user: userJson,
      access_token,
    };
  }
}

