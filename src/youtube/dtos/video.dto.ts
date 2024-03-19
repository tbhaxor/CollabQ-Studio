import { youtube_v3 } from "@googleapis/youtube";
import { Transform, Type, plainToInstance } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class VideoStatusDto implements youtube_v3.Schema$VideoStatus {
  @IsString()
  @IsOptional()
  uploadStatus?: string;

  @IsBoolean()
  @IsOptional()
  embeddable?: boolean;

  @IsString()
  @IsOptional()
  failureReason?: string;

  @IsString()
  @IsOptional()
  license?: string;

  @IsBoolean()
  @IsOptional()
  madeForKids?: boolean;

  @IsString()
  @IsOptional()
  privacyStatus?: string;

  @IsBoolean()
  @IsOptional()
  publicStatsViewable?: boolean;

  @IsDateString()
  @IsOptional()
  publishAt?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsBoolean()
  @IsOptional()
  selfDeclaredMadeForKids?: boolean;
}

export class VideoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform((p) => parseInt(p.value))
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @IsArray({ each: true })
  tags: string[];

  @IsString()
  thumbnail: string;

  @IsDateString()
  publishedAt: string;

  @Type(() => VideoStatusDto)
  @ValidateNested()
  @IsObject()
  status: VideoStatusDto;

  static transform(video: youtube_v3.Schema$Video): VideoDto {
    return plainToInstance(VideoDto, {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
      tags: video.snippet.tags || [],
      publishedAt: video.snippet.publishedAt,
      categoryId: video.snippet.categoryId,
      status: video.status,
    });
  }
}
