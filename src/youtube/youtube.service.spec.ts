import { Test, TestingModule } from "@nestjs/testing";
import { YoutubeService } from "./youtube.service";
import { GoogleService } from "../clients/google.service";
import { PrismaModule } from "../prisma/prisma.module";

describe("YoutubeService", () => {
  let service: YoutubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [YoutubeService, GoogleService],
    }).compile();

    service = module.get<YoutubeService>(YoutubeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
