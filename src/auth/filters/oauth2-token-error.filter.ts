import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { TokenError } from "passport-oauth2";

@Catch(TokenError)
export class Oauth2TokenErrorFilter implements ExceptionFilter {
  catch(_exception, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    return response.status(406).json({
      statusCode: 406,
      error: "Not Acceptable",
      message: "Can not re-use the OAuth grant token.",
    });
  }
}
