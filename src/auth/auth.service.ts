import { Profile } from 'passport-google-oauth20';
import { AccountsService } from '../accounts/accounts.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private jwtService: JwtService,
  ) {}

  async upsertAccountWithTokens(audience: AccountType, accessToken: string, refreshToken: string, profile: Profile) {
    const account = await this.accountsService.getAccountBySocialProvideId(profile.id).then((account) => {
      if (account == null) {
        return this.accountsService.createAccount(profile.emails[0].value, profile.displayName, audience);
      }
      return account;
    });
    const socialAccount = await this.accountsService.upsertSocialAccount(account.id, 'google', profile.id);

    // Only manager is required to store the access tokens
    // As mentioned by Harkirat in the video.
    if (audience === 'owner') {
      await this.accountsService.upsertAccessToken(socialAccount.id, accessToken, refreshToken);
    }
    return account;
  }

  async getAccountById(accountId: string) {
    const account = await this.accountsService.getAccountById(accountId);
    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }

  private getAudience(accountType: AccountType) {
    if (process.env.JWT_AUDIENCE) {
      return process.env.JWT_AUDIENCE!;
    }
    return `app://collabq.studio/client.${accountType}`;
  }

  async signJwt(userId: bigint, accounType: AccountType) {
    return this.jwtService.sign({}, { audience: this.getAudience(accounType), subject: userId.toJSON() });
  }
}
