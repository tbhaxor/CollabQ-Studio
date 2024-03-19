import { Test, TestingModule } from "@nestjs/testing";
import { GoogleService } from "./google.service";
import { PrismaModule } from "../prisma/prisma.module";

describe("GoogleService", () => {
  let service: GoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GoogleService],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
