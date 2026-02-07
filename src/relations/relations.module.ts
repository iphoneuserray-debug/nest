import { Module } from '@nestjs/common';
import { RelationsController } from './relations.controller';
import { RelationsService } from './relations.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './entity/relation.entity';

@Module({
    imports: [CompaniesModule, TypeOrmModule.forFeature([Relation])],
    controllers: [RelationsController],
    providers: [RelationsService],
})
export class RelationsModule { }
