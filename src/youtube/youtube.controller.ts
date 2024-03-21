import { Controller, Get, Param, Query, UseFilters, UseGuards } from '@nestjs/common';
import { Account } from '@prisma/client';
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
  getChannels(@User() user: Account, @Query('channelId') channelId?: string) {
    if (typeof channelId === 'string') {
      return this.youtubeService.getChannelById(user.id, channelId).then((channel) => [channel]);
    }
    return this.youtubeService.getChannels(user.id);
  }

  @Get('/playlists')
  getChannelPlaylists(
    @User() user: Account,
    @Query('channelId', RequiredPipe) channelId: string,
    @Query('playlistId') playlistId?: string,
  ) {
    if (typeof playlistId === 'string') {
      return this.youtubeService.getPlaylistById(user.id, channelId, playlistId);
    }
    return this.youtubeService.getPlaylists(user.id, channelId);
  }

  @Get('/playlists/:playlistId/items')
  getChannelPlaylistItems(@User() user: Account, @Param('playlistId') playlistId: string) {
    return this.youtubeService.getPlaylistItems(user.id, playlistId);
  }

  @Get('/videos/:videoId')
  getVideo(@User() user: Account, @Param('videoId') videoId: string) {
    return this.youtubeService.getVideoById(user.id, videoId);
  }
}
