import { Controller, Get, Param, Query, UseFilters, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Account } from "../accounts/decorators/account.decorator";
import { YoutubeService } from "./youtube.service";
import { GaxiosErrorFilter } from "../utilities/filters/gaxios-error.filter";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RequiredPipe } from "../utilities/pipes/required.pipe";

@Controller("youtube")
@UseGuards(JwtAuthGuard)
@UseFilters(GaxiosErrorFilter)
export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}

  @Get("/channels")
  getChannels(@Account() account: Prisma.AccountGetPayload<{}>, @Query("channelId") channelId?: string) {
    if (typeof channelId === "string") {
      return this.youtubeService.getChannelById(account.id, channelId).then((channel) => [channel]);
    }
    return this.youtubeService.getChannels(account.id);
  }

  @Get("/playlists")
  getChannelPlaylists(
    @Account() account: Prisma.AccountGetPayload<{}>,
    @Query("channelId", RequiredPipe) channelId: string,
    @Query("playlistId") playlistId?: string,
  ) {
    if (typeof playlistId === "string") {
      return this.youtubeService.getPlaylistById(account.id, channelId, playlistId);
    }
    return this.youtubeService.getPlaylists(account.id, channelId);
  }

  @Get("/playlists/:playlistId/items")
  getChannelPlaylistItems(@Account() account: Prisma.AccountGetPayload<{}>, @Param("playlistId") playlistId: string) {
    return this.youtubeService.getPlaylistItems(account.id, playlistId);
  }

  @Get("/videos/:videoId")
  getVideo(@Account() account: Prisma.AccountGetPayload<{}>, @Param("videoId") videoId: string) {
    return this.youtubeService.getVideoById(account.id, videoId);
  }
}
