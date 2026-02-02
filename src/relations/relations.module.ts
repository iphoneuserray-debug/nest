import { Module } from '@nestjs/common';
import { RelationsController } from './relations.controller';
import { RelationsService } from './relations.service';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
    imports: [CompaniesModule],
    controllers: [RelationsController],
    providers: [RelationsService],
})
export class RelationsModule { }
