import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { faker } from "@faker-js/faker";

const name = faker.person.firstName();
describe("AppController (/app)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/hello (GET)", () => {
    return request(app.getHttpServer()).get("/app/hello").expect(200).expect("Hello World!");
  });

  it(`/hello?name=${name} (GET)`, () => {
    return request(app.getHttpServer()).get(`/app/hello?name=${name}`).expect(200).expect(`Hello ${name}!`);
  });
});
