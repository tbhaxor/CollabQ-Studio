import { Controller, Get, UseFilters, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { Account } from "../accounts/decorators/account.decorator";
import { GoogleAuthGuard } from "./guards/google.guard";
import { Oauth2TokenErrorFilter } from "./filters/oauth2-token-error.filter";

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get("login")
  @UseGuards(GoogleAuthGuard)
  async login() {}

  @Get("callback")
  @UseFilters(Oauth2TokenErrorFilter)
  @UseGuards(GoogleAuthGuard)
  async callback(@Account() account: Prisma.AccountGetPayload<{}>) {
    const accessToken = await this.jwtService.signAsync({ displayName: account.name }, { subject: account.id.toString() });
    return { account, accessToken };
  }
}
