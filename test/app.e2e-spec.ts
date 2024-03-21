import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

const name = faker.person.firstName();
describe('AppController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/hello (GET)', () => {
    return request(app.getHttpServer()).get('/app/hello').expect(200).expect('Hello World!');
  });

  test(`/hello?name=${name} (GET)`, () => {
    return request(app.getHttpServer()).get(`/app/hello?name=${name}`).expect(200).expect(`Hello ${name}!`);
  });
});
