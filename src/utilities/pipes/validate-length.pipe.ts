import { ArgumentMetadata, BadRequestException, Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

export type ValidateLengthPipeOptions = {
  min?: number;
  max?: number;
};

@Injectable()
export class ValidateLengthPipe implements PipeTransform {
  private readonly options: ValidateLengthPipeOptions;

  constructor(options: ValidateLengthPipeOptions) {
    this.options = options;
    if (typeof options.max != 'number' && typeof options.min != 'number') {
      throw new InternalServerErrorException("Both `min` and `max` can't be left optional at same time.");
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value == 'undefined' || value === null || typeof value.length === 'undefined') {
      return value;
    }

    if (typeof this.options.min === 'number' && this.options.min >= value.length) {
      throw new BadRequestException(`Length ${metadata.data} should greater than ${this.options.min}.`);
    }

    if (typeof this.options.max === 'number' && this.options.max <= value.length) {
      throw new BadRequestException(`Length of ${metadata.data} should less than ${this.options.max}.`);
    }

    return value;
  }
}
