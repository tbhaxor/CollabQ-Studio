import { youtube_v3 } from '@googleapis/youtube';
import { Transform, plainToInstance } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VideoCategoryDto {
  @IsInt()
  @Transform((p) => parseInt(p.value))
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isAssignable: boolean;

  static transform(category: youtube_v3.Schema$VideoCategory): VideoCategoryDto {
    return plainToInstance(VideoCategoryDto, {
      id: category.id,
      name: category.snippet.title,
      isAssignable: category.snippet.assignable,
    });
  }
}
