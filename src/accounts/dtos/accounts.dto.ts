import { $Enums, Account } from '@prisma/client';
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class AccountDto implements Account {
  id: bigint;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsIn(Object.values($Enums.AccountType))
  type: $Enums.AccountType;

  @IsNotEmpty()
  name: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class UpdateAccountDto extends PickType(AccountDto, ['email', 'name'] as const) {}
