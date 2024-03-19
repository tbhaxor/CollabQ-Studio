import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { $Enums } from "@prisma/client";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/callback`,
      passReqToCallback: true,
    });
  }

  validate(request: Request, accessToken: string, refreshToken: string, profile: Profile) {
    return this.authService.upsertAccountWithTokens(
      <$Enums.AccountType>request.query.state,
      accessToken,
      refreshToken,
      profile,
    );
  }
}
