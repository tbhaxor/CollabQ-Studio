import { BadRequestException, ConsoleLogger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, AccountType, SocialAccount } from '@prisma/client';
import Axios, { AxiosError } from 'axios';
import { UpdateAccountDto } from './accounts.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new ConsoleLogger(AccountsService.name, {
    timestamp: true,
    logLevels: process.env.NODE_ENV === 'test' && ['fatal'],
  });

  constructor(private prismaService: PrismaService) {}

  getAccountById(accountId: string | bigint) {
    if (typeof accountId === 'string') {
      accountId = BigInt(accountId);
    }

    return this.prismaService.account.findFirst({ where: { id: accountId } });
  }

  getAccountBySocialProvideId(profileId: string) {
    return this.prismaService.account.findFirst({ where: { socialAccounts: { some: { providerId: profileId } } } });
  }

  createAccount(email: string, displayName: string, type: AccountType) {
    return this.prismaService.account.create({
      data: { email, name: displayName, type },
    });
  }

  upsertSocialAccount(accountId: Account['id'], provider: SocialAccount['provider'], providerId: string) {
    return this.prismaService.socialAccount.upsert({
      where: { providerId_accountId: { accountId: accountId, providerId } },
      create: { providerId, accountId: accountId, provider },
      update: {},
    });
  }

  upsertAccessToken(socialAccountId: SocialAccount['id'], accessToken: string, refreshToken?: string) {
    return this.prismaService.accessToken.upsert({
      where: { socialAccountId },
      create: { accessToken, refreshToken, socialAccountId: socialAccountId },
      update: { accessToken, refreshToken },
    });
  }

  async revokeAccessToken(accountId: bigint) {
    const token = await this.prismaService.accessToken.findFirst({
      where: { socialAccount: { accountId, provider: 'google' } },
    });

    if (!token) {
      throw new BadRequestException('Unable to find access tokens for the account.');
    }

    try {
      await Axios.post('https://oauth2.googleapis.com/revoke', null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: { token: token.accessToken },
      });
    } catch (error) {
      this.logger.error(error, error);
      if (error instanceof AxiosError) {
        throw new BadRequestException(error.response.data.error_description);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteAccountById(accountId: bigint) {
    await this.prismaService.account.delete({ where: { id: accountId } });
  }

  async updateAccountById(accountId: bigint, payload: UpdateAccountDto, isEmailChange: boolean) {
    if (isEmailChange) {
      const isAnotherExists = await this.prismaService.account
        .count({
          where: { email: payload.email },
        })
        .then((count) => count === 1);
      if (isAnotherExists) {
        throw new BadRequestException(['new email already exists']);
      }
    }
    return this.prismaService.account.update({
      where: { id: accountId },
      data: payload,
    });
  }
}
