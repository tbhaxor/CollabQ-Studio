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

    if (typeof options.max === 'number' && !Number.isInteger(options.max)) {
      throw new InternalServerErrorException('Maximum length must be integeral value.');
    }

    if (typeof options.min === 'number' && !Number.isInteger(options.min)) {
      throw new InternalServerErrorException('Minimum length must be integeral value.');
    }

    if (options.min < 0) {
      throw new InternalServerErrorException("Minimum value can't be less than 0.");
    }

    if (options.max < options.min) {
      throw new InternalServerErrorException("Minimum value can't be greater than maximum value.");
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value?.length === 'undefined') {
      throw new BadRequestException(`${metadata.data || metadata.type} doesn't have length property.`);
    }

    if (this.isExact && value.length != this.options.min) {
      throw new BadRequestException(`Length of ${metadata.data || metadata.type} should be exactly ${this.options.min}.`);
    }

    if (this.options.min > value.length) {
      throw new BadRequestException(`Length of ${metadata.data || metadata.type} should greater than ${this.options.min}.`);
    }
    if (this.options.max < value.length) {
      throw new BadRequestException(`Length of ${metadata.data || metadata.type} should less than ${this.options.max}.`);
    }

    return value;
  }

  get isExact() {
    return this.options.min == this.options.max;
  }
}
