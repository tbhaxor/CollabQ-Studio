import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { Account } from '@prisma/client';
import { User } from './decorators/user.decorator';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './accounts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/me')
  getAccount(@User() user: Account) {
    return user;
  }

  @Put('/me')
  updateAccount(@User() user: Account, @Body() updateAccount: UpdateAccountDto) {
    return this.accountsService.updateAccountById(user.id, updateAccount, user.email != updateAccount.email);
  }

  @Delete('/me')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteAccount(@User() user: Account) {
    await this.accountsService.revokeAccessToken(user.id);
    await this.accountsService.deleteAccountById(user.id);
  }
}
