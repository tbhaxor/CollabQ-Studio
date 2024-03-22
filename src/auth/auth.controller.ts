import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { Account } from '@prisma/client';
import { User } from '../accounts/decorators/user.decorator';
import { GoogleAuthGuard } from './guards/google.guard';
import { Oauth2TokenErrorFilter } from './filters/oauth2-token-error.filter';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  async login() {}

  @Get('callback')
  @UseFilters(Oauth2TokenErrorFilter)
  @UseGuards(GoogleAuthGuard)
  async callback(@User() user: Account) {
    const accessToken = await this.authService.signJwt(user);
    return { user, accessToken };
  }
}
