import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { GaxiosError } from "gaxios";
import { Logger } from "../logger.utility";

@Catch(GaxiosError)
export class GaxiosErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(GaxiosError.name, {
    timestamp: true,
    logLevels: process.env.NODE_ENV === "test" && ["fatal"],
  });

  async catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof GaxiosError) {
      this.logger.error(exception);
      const response = host.switchToHttp().getResponse<Response>();
      return response.status(500).json({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Unable to perform action on Google service at this time.",
      });
    }
  }
}
