import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Account } from '@prisma/client';
import { Request } from 'express';

export const User = createParamDecorator((accountKey: keyof Account | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (typeof accountKey === 'undefined') {
    return request.user;
  }
  return request.user[accountKey];
});
