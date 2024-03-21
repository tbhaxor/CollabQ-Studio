import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaErrorFilter } from './utilities/filters/prisma-error.filter';

// Ref: https://github.com/prisma/studio/issues/614
BigInt.prototype.toJSON = function () {
  return this.toString();
};

(async () => {
  if (process.env.NODE_ENV != 'production') {
    await import('dotenv').then((dotenv) => dotenv.config());
  }

  const app = await import('./app.module').then(({ AppModule }) => NestFactory.create(AppModule));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableCircularCheck: true },
      validationError: { target: true, value: true },
      exceptionFactory([error]) {
        const firstErrorMessage = Object.values(error.constraints)[0];
        if (!firstErrorMessage.startsWith(error.property)) {
          return new BadRequestException(firstErrorMessage[0].toUpperCase() + firstErrorMessage.slice(1) + '.');
        }

        return new BadRequestException(
          firstErrorMessage
            .split(' ')
            .map((value, index) => (index === 0 ? `\`${value}\`` : value))
            .concat('.')
            .join(' '),
        );
      },
    }),
  );
  app.useGlobalFilters(new PrismaErrorFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || true,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || '*',
    exposedHeaders: process.env.CORE_EXPOSED_HEADERS?.split(',') || '*',
  });

  await app.listen(3000);
})();
