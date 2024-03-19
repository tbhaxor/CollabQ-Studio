import { ConsoleLogger } from "@nestjs/common";

export class Logger extends ConsoleLogger {
  error(message: any, stackOrContext?: string): void;
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: any[]): void;
  error(message: unknown): void {
    super.error(message);
    if (message instanceof Error) {
      console.error(message.stack.split("\n").slice(1).join("\n"));
    }
  }

  fatal(message: any, context?: string): void;
  fatal(message: any, ...optionalParams: any[]): void;
  fatal(message: unknown): void {
    if (message instanceof Error) {
      const errMessage = message.message
        .split("\n")
        .filter((v) => !!v)
        .join(". ");

      super.fatal(`${message.name}: ${errMessage}`);
    } else {
      super.fatal(message);
    }
    process.exit(1);
  }
}
