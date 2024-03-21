import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'undefined' || value === null) {
      throw new BadRequestException([`${metadata.data} is required`]);
    }
    return value;
  }
}
