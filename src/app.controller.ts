import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("/app")
export class AppController {
  constructor(private appService: AppService) {}

  @Get("/hello")
  helloWorld(@Query("name") name?: string) {
    return this.appService.greet(name);
  }
}
