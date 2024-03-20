import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Logger } from "../logger.utility";
import { Response } from "express";

@Catch(PrismaClientValidationError, PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaErrorFilter.name);
  catch(exception: PrismaClientValidationError | PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(exception);

    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof PrismaClientKnownRequestError) {
      // TODO: Add message here
    }

    if (exception instanceof PrismaClientValidationError) {
      return response.status(500).json({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Failed to save the information in the database. Contact developers.",
      });
    }
  }
}
