import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelDto } from './dtos/channel.dto';
import { GoogleService } from '../clients/google.service';
import { PlaylistDto } from './dtos/playlist.dto';
import { VideoDto } from './dtos/video.dto';
import { VideoCategoryDto } from './dtos/video-category.dto';

@Injectable({})
export class YoutubeService {
  private readonly channelParts: string[] = ['snippet', 'statistics'];

  constructor(private readonly googleService: GoogleService) {}

  async getVideoCategories(accountId: bigint, country: string, onlyAssignable: boolean) {
    let categories = await this.googleService
      .getYoutubeClient(accountId)
      .then((yt) => yt.videoCategories.list({ part: ['snippet'], regionCode: country }))
      .then((response) => response.data.items);
    if (onlyAssignable) {
      categories = categories.filter((category) => category.snippet.assignable);
    }

    return categories.map((category) => VideoCategoryDto.transform(category));
  }

  getChannels(accountId: bigint) {
    return this.googleService
      .getYoutubeClient(accountId)
      .then((yt) => yt.channels.list({ part: this.channelParts, mine: true }))
      .then((response) => response.data.items) // just to make it more clear
      .then((channels) => channels.map((channel) => ChannelDto.transform(channel)));
  }

  getChannelById(accountId: bigint, channelId: string) {
    return this.googleService
      .getYoutubeClient(accountId)
      .then((yt) => yt.channels.list({ part: this.channelParts, id: [channelId] }))
      .then((response) => (Array.isArray(response.data.items) && response.data.items[0]) || null)
      .then((channel) => {
        if (channel) {
          return ChannelDto.transform(channel);
        }
        throw new NotFoundException(`Invalid channel id.`);
      });
  }

  async getUploadPlaylist(accountId: bigint, channelId: string) {
    const [yt, channel] = await Promise.all([
      this.googleService.getYoutubeClient(accountId),
      this.getChannelById(accountId, channelId),
    ]);

    return yt.channels
      .list({ part: ['contentDetails'], id: [channelId] })
      .then((response) => Array.isArray(response.data.items) && response.data.items[0])
      .then((playlist) =>
        PlaylistDto.transform({
          id: playlist.id,
          snippet: {
            title: 'Uploads',
            publishedAt: channel.publishedAt,
            description: 'Built-in all videos uploads.',
            thumbnails: { default: { url: channel.thumbnail } },
          },
        }),
      );
  }

  async getPlaylists(accountId: bigint, channelId: string) {
    const yt = await this.googleService.getYoutubeClient(accountId);

    const [playlists, uploadPlaylist] = await Promise.all([
      yt.playlists
        .list({ part: ['snippet'], channelId })
        .then((response) => response.data.items)
        .then((playlists) => (Array.isArray(playlists) && playlists) || [])
        .then((playlists) => playlists.map((playlist) => PlaylistDto.transform(playlist))),
      this.getUploadPlaylist(accountId, channelId),
    ]);

    return [uploadPlaylist].concat(...playlists);
  }

  async getPlaylistById(accountId: bigint, channelId: string, playlistId: string) {
    const yt = await this.googleService.getYoutubeClient(accountId);

    const [playlists, uploadPlaylist] = await Promise.all([
      yt.playlists
        .list({ part: ['snippet'], id: [playlistId] })
        .then((response) => response.data.items)
        .then((playlists) => (Array.isArray(playlists) && playlists) || [])
        .then((playlists) => playlists.map((playlist) => PlaylistDto.transform(playlist))),
      this.getUploadPlaylist(accountId, channelId),
    ]);

    const targetPlaylist = playlists[0] || uploadPlaylist;

    if (!targetPlaylist) {
      throw new NotFoundException(`Invalid playlist id.`);
    }

    return targetPlaylist;
  }

  getPlaylistItems(accountId: bigint, playlistId: string) {
    return this.googleService
      .getYoutubeClient(accountId)
      .then((yt) => yt.playlistItems.list({ part: ['snippet'], playlistId }))
      .then((response) => response.data.items);
  }

  getVideoById(accountId: bigint, videoId: string) {
    return this.googleService
      .getYoutubeClient(accountId)
      .then((yt) => yt.videos.list({ part: ['snippet', 'contentDetails', 'status', 'topicDetails'], id: [videoId] }))
      .then((response) => (Array.isArray(response.data.items) && response.data.items[0]) || null)
      .then((video) => {
        if (!video) {
          throw new NotFoundException('Invalid video id.');
        }
        return VideoDto.transform(video);
      });
  }

  getVideoFromPlaylistItem() {}
}
