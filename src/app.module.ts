import { Module } from "@nestjs/common";
import { AccountsModule } from "./accounts/accounts.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { YoutubeModule } from "./youtube/youtube.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
  imports: [AccountsModule, PrismaModule, AuthModule, YoutubeModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
