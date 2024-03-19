import { Global, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Logger } from "../utilities/logger.utility";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaModule.name, {
    timestamp: true,
    logLevels: process.env.NODE_ENV === "test" && ["fatal"],
  });

  constructor(private prismaService: PrismaService) {}

  async onModuleDestroy() {
    await this.prismaService.$disconnect();
  }

  async onModuleInit() {
    this.logger.log("Connecting to the database");
    try {
      await this.prismaService.$connect();
      this.logger.log("Connected to the database");
    } catch (error) {
      this.logger.fatal(error);
    }
  }
}
