import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { GoogleService } from '../clients/google.service';

@Module({
  providers: [YoutubeService, GoogleService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
