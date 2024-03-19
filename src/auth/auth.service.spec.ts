import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AccountsModule } from "../accounts/accounts.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.stategy";
import { PrismaModule } from "../prisma/prisma.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AccountsModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          verifyOptions: {
            issuer: process.env.JWT_ISSUER || "app://collabq.studio",
            audience: process.env.JWT_AUDIENCE || "app://collabq.studio",
            algorithms: ["HS512"],
          },
          signOptions: {
            expiresIn: "1d",
            algorithm: "HS512",
            issuer: process.env.JWT_ISSUER || "app://collabq.studio",
            audience: process.env.JWT_AUDIENCE || "app://collabq.studio",
          },
        }),
      ],
      providers: [AuthService, GoogleStrategy, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
