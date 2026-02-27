import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ApplicationModule } from "../application/application.module";
import { env } from "../infrastructure/config/env";
import { AuthController } from "./controllers/auth.controller";
import { UsersController } from "./controllers/users.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ApplicationModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: env.jwtSecret,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [JwtStrategy],
  controllers: [AuthController, UsersController],
})
export class HttpModule {}

