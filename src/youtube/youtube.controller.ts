import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query, UseFilters, UseGuards } from '@nestjs/common';
import { User } from '../accounts/decorators/user.decorator';
import { YoutubeService } from './youtube.service';
import { GaxiosErrorFilter } from '../utilities/filters/gaxios-error.filter';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequiredPipe } from '../utilities/pipes/required.pipe';
import { Role } from '../auth/decorators/role.decorator';
import { AllowedRolesGuard } from '../auth/guards/allowed-roles.guard';

@Controller('youtube')
@Role('owner')
@UseGuards(JwtAuthGuard, AllowedRolesGuard)
@UseFilters(GaxiosErrorFilter)
export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}

  @Get('/channels')
  getChannels(@User('id') userId: bigint, @Query('channelId') channelId?: string) {
    if (typeof channelId === 'string') {
      return this.youtubeService.getChannelById(userId, channelId).then((channel) => [channel]);
    }
    return this.youtubeService.getChannels(userId);
  }

  @Get('/playlists')
  getChannelPlaylists(
    @User('id') userId: bigint,
    @Query('channelId', RequiredPipe) channelId: string,
    @Query('playlistId') playlistId?: string,
  ) {
    if (typeof playlistId === 'string') {
      return this.youtubeService.getPlaylistById(userId, channelId, playlistId);
    }
    return this.youtubeService.getPlaylists(userId, channelId);
  }

  @Get('/playlists/:playlistId/items')
  getChannelPlaylistItems(@User('id') userId: bigint, @Param('playlistId') playlistId: string) {
    return this.youtubeService.getPlaylistItems(userId, playlistId);
  }

  @Get('/videos/:videoId')
  getVideo(@User('id') userId: bigint, @Param('videoId') videoId: string) {
    return this.youtubeService.getVideoById(userId, videoId);
  }
}
