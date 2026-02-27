import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { RequestUser } from "../strategies/jwt.strategy";

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return request.user.userId;
  }
);
