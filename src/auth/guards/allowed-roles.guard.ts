import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../decorators/role.decorator';
import { Request } from 'express';
import { AccountType } from '@prisma/client';

@Injectable()
export class AllowedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<AccountType[] | undefined>(ROLE, [context.getClass(), context.getHandler()]);

    if (typeof roles === 'undefined') {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    return roles.includes(request.user.type);
  }
}
