import { Prisma } from "@prisma/client";
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import { PickType } from "@nestjs/mapped-types";

export class AccountDto implements Prisma.AccountGetPayload<{}> {
  id: bigint;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsIn(["manager", "team"])
  type: "manager" | "team";

  @IsNotEmpty()
  name: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class UpdateAccountDto extends PickType(AccountDto, ["email", "name"] as const) {}
