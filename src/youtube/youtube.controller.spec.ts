import { Test, TestingModule } from "@nestjs/testing";
import { YoutubeController } from "./youtube.controller";
import { YoutubeService } from "./youtube.service";
import { GoogleService } from "../clients/google.service";
import { PrismaModule } from "../prisma/prisma.module";

describe("YoutubeController", () => {
  let controller: YoutubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [YoutubeController],
      providers: [YoutubeService, GoogleService],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
