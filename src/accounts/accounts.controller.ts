import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Account } from "./decorators/account.decorator";
import { AccountsService } from "./accounts.service";
import { UpdateAccountDto } from "./accounts.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller("accounts")
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get("/me")
  getAccount(@Account() account: Prisma.AccountGetPayload<{}>) {
    return account;
  }

  @Put("/me")
  updateAccount(@Account() account: Prisma.AccountGetPayload<{}>, @Body() updateAccount: UpdateAccountDto) {
    return this.accountsService.updateAccountById(account.id, updateAccount, account.email != updateAccount.email);
  }

  @Delete("/me")
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteAccount(@Account() account: Prisma.AccountGetPayload<{}>) {
    await this.accountsService.revokeAccessToken(account.id);
    await this.accountsService.deleteAccountById(account.id);
  }
}
