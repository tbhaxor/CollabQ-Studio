import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { Account } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { User } from '../accounts/decorators/user.decorator';
import { GoogleAuthGuard } from './guards/google.guard';
import { Oauth2TokenErrorFilter } from './filters/oauth2-token-error.filter';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  async login() {}

  @Get('callback')
  @UseFilters(Oauth2TokenErrorFilter)
  @UseGuards(GoogleAuthGuard)
  async callback(@User() user: Account) {
    const accessToken = await this.jwtService.signAsync({ displayName: user.name }, { subject: user.id.toString() });
    return { user, accessToken };
  }
}
