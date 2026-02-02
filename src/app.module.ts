import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { RelationsModule } from './relations/relations.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
    imports: [UsersModule, CompaniesModule, RelationsModule, AccountsModule],
})
export class AppModule { }
