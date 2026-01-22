import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [UsersModule, CompaniesModule],
})
export class AppModule {}
