import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.stategy";
import { PassportModule } from "@nestjs/passport";
import { AccountsModule } from "../accounts/accounts.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      verifyOptions: {
        issuer: process.env.JWT_ISSUER || "app://collabq.studio/backend",
        audience: process.env.JWT_AUDIENCE || "app://collabq.studio/client",
        algorithms: ["HS512"],
        ignoreExpiration: false,
        ignoreNotBefore: false,
      },
      signOptions: {
        expiresIn: "1d",
        algorithm: "HS512",
        issuer: process.env.JWT_ISSUER || "app://collabq.studio/backend",
        audience: process.env.JWT_AUDIENCE || "app://collabq.studio/client",
      },
    }),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
