import { Controller, Get, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { Account } from "../accounts/decorators/account.decorator";
import { GoogleAuthGuard } from "./guards/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get("login")
  @UseGuards(GoogleAuthGuard)
  async login() {}

  @Get("callback")
  @UseGuards(GoogleAuthGuard)
  async callback(@Account() account: Prisma.AccountGetPayload<{}>) {
    const accessToken = await this.jwtService.signAsync({ displayName: account.name }, { subject: account.id.toString() });
    return { account, accessToken };
  }
}
