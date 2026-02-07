import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Account } from 'src/accounts/entity/account.entity';
import { Company } from 'src/companies/entity/company.entity';
import { Relation } from 'src/relations/entity/relation.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Account, Company, Relation])],
    providers: [SeedService],
})
export class SeedModule { }
