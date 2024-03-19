// snippet: {
//   description: "Built-in all videos uploads.",
//   channelId,
//   channelTitle: channel.title,
//   defaultLanguage: "Uploads",
//   title: "Uploads",
//   localized: { description: "Build-in all videos uploads.", title: "Uploads" },
//   publishedAt: channel.publishedAt,
//   thumbnails: { default: { url: channel.thumbnail } },
// },

import { youtube_v3 } from "@googleapis/youtube";
import { plainToInstance } from "class-transformer";
import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

// id: playlist.contentDetails.relatedPlaylists.uploads,
export class PlaylistDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  publishedAt: Date;

  @IsUrl()
  thumbnail: string;

  static transform(playlist: youtube_v3.Schema$Playlist): PlaylistDto {
    return plainToInstance(PlaylistDto, {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      publishedAt: playlist.snippet.publishedAt,
      thumbnail: playlist.snippet.thumbnails.default.url,
    });
  }
}
