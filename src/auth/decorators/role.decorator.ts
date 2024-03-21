import { SetMetadata } from '@nestjs/common';
import { AccountType } from '@prisma/client';

export const ROLE = 'AccountRole';
export const Role = (...roles: AccountType[]) => SetMetadata(ROLE, roles);
