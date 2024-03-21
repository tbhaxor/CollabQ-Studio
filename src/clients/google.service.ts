import { youtube_v3 } from '@googleapis/youtube';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleService {
  constructor(private prismaService: PrismaService) {}

  async getYoutubeClient(accountId: bigint): Promise<youtube_v3.Youtube> {
    const token = await this.prismaService.accessToken.findFirst({ where: { socialAccount: { accountId } } });
    if (!token) {
      throw new UnprocessableEntityException("Couldn't find access token for the user account.");
    }

    const oauth2 = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    oauth2.setCredentials({ access_token: token.accessToken, refresh_token: token.refreshToken });

    return new youtube_v3.Youtube({ auth: oauth2 });
  }
}
