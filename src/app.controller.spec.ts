import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { faker } from "@faker-js/faker";

describe("AppController", () => {
  let controller: AppController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("helloWorld", () => {
    it('should return "Hello, World!" when name is not provided', () => {
      expect(controller.helloWorld()).toBe("Hello World!");
    });

    it("should return name in return when provided", () => {
      const name = faker.person.firstName();
      expect(controller.helloWorld(name)).toBe(`Hello ${name}!`);
    });
  });
});
