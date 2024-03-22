import { InternalServerErrorException } from '@nestjs/common';
import { ValidateLengthPipe } from './validate-length.pipe';
import { faker } from '@faker-js/faker';

describe('ValidateLengthPipe', () => {
  it('should throw InternalServerErrorException on empty object', () => {
    expect(() => new ValidateLengthPipe({})).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when min < 0', () => {
    const number = faker.number.int({ min: -100, max: -1 });
    expect(() => new ValidateLengthPipe({ min: number })).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when max < min', () => {
    const minNumber = faker.number.int({ min: 0, max: 10 });
    const maxNumber = faker.number.int({ min: -10, max: -1 });
    expect(() => new ValidateLengthPipe({ min: minNumber, max: maxNumber })).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when either value is not integer', () => {
    expect(() => new ValidateLengthPipe({ min: faker.number.float() })).toThrow(InternalServerErrorException);
    expect(() => new ValidateLengthPipe({ max: faker.number.float() })).toThrow(InternalServerErrorException);
  });

  it('should be defined when either of field is defined', () => {
    expect(new ValidateLengthPipe({ min: 0 })).toBeDefined();
    expect(new ValidateLengthPipe({ max: 0 })).toBeDefined();
  });

  it('should be defined when both length constraints are valid', () => {
    const minNumber = faker.number.int({ min: 0 });
    const maxNumber = faker.number.int({ min: minNumber });

    expect(new ValidateLengthPipe({ min: minNumber, max: maxNumber })).toBeDefined();
  });

  it('should return isExact true if min == max', () => {
    const minMax = faker.number.int();
    expect(new ValidateLengthPipe({ min: minMax, max: faker.number.int({ min: minMax }) }).isExact).toBe(false);
    expect(new ValidateLengthPipe({ min: minMax, max: minMax }).isExact).toBe(true);
  });
});
