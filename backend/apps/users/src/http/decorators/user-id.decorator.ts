import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtPayload } from "../strategies/jwt.strategy";

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user as JwtPayload;
    return user.sub;
  }
);

