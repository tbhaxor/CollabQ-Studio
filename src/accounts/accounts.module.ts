import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Axios } from 'axios';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: Axios.name,
      useValue: new Axios({
        baseURL: 'https://oauth2.googleapis.com',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    },
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
