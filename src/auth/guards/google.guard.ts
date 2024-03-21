import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountType } from '@prisma/client';
import { Request } from 'express';
import { AuthenticateOptionsGoogle } from 'passport-google-oauth20';
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext): AuthenticateOptionsGoogle {
    const request = this.getRequest(context);
    let audience = <AccountType>request.query.audience;
    if (request.url.startsWith('/auth/callback')) {
      audience = <AccountType>request.query.state;
    }

    switch (audience) {
      case 'owner':
        return {
          accessType: 'offline',
          prompt: 'consent',
          scope: ['https://www.googleapis.com/auth/youtube', 'profile', 'email'],
          state: 'manager',
        };
      case 'editor':
        return { state: 'team', scope: ['profile', 'email'] };
      default:
        if (!request.query.audience) {
          throw new BadRequestException("'audience' query parameter is required.");
        }
        throw new BadRequestException(`Invalid audience type ${audience} found.`);
    }
  }

  getRequest(context: ExecutionContext): Request {
    return super.getRequest(context);
  }
}
