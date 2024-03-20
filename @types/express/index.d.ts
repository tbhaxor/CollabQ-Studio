import { Prisma } from "@prisma/client";

// https://github.com/DefinitelyTyped/DefinitelyTyped/commit/91c229dbdb653dbf0da91992f525905893cbeb91#r34812715
declare global {
  namespace Express {
    interface User extends Prisma.AccountGetPayload<{}> {}
  }
}
