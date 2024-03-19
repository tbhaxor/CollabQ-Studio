import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidateEnumPipe implements PipeTransform {
  constructor(private values: any[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.values.includes(value)) {
      throw new BadRequestException([`${metadata.data} expects value from [${this.values.join(", ")}]`]);
    }
    return value;
  }
}
