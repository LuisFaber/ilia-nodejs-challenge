import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "../../infrastructure/config/env";

export interface JwtPayload {
  sub: string;
}

export interface RequestUser {
  userId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
  }

  validate(payload: JwtPayload): RequestUser {
    const userId = payload.sub;
    if (!userId || typeof userId !== "string") {
      throw new UnauthorizedException("Access token is missing or invalid");
    }
    return { userId };
  }
}
