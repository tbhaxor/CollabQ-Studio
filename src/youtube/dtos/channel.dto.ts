import { youtube_v3 } from "@googleapis/youtube";
import { Type, plainToInstance } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";

// https://stackoverflow.com/questions/57153948/adding-validation-for-required-params-in-nestjs-using-class-validator
// By default class validator will mark the fields as required, use @IsOptional()
export class ChannelStatisticsDto implements youtube_v3.Schema$ChannelStatistics {
  @IsString()
  @IsOptional()
  commentCount?: string;

  @IsBoolean()
  @IsOptional()
  hiddenSubscriberCount?: boolean;

  @IsString()
  @IsOptional()
  subscriberCount?: string;

  @IsString()
  @IsOptional()
  videoCount?: string;

  @IsString()
  @IsOptional()
  viewCount?: string;
}

export class ChannelDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  country?: string;

  @IsString()
  @IsOptional()
  customHandle?: string;

  @IsDateString()
  publishedAt: string;

  @IsUrl()
  thumbnail: string;

  // Following configuration for nested types
  // https://stackoverflow.com/a/62984818/10362396
  @Type(() => ChannelStatisticsDto)
  @ValidateNested()
  @IsDefined()
  @IsObject()
  statistics: ChannelStatisticsDto;

  static transform(channel: youtube_v3.Schema$ChannelListResponse["items"][0]): ChannelDto {
    return plainToInstance(ChannelDto, {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      country: channel.snippet.country,
      customHandle: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      thumbnail: channel.snippet.thumbnails.default.url,
      statistics: channel.statistics,
    });
  }
}
