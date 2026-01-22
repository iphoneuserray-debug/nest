import type { Company } from './interfaces/company.interface';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() createCompanyDto: CreateCompanyDto) {
    const company = { ...createCompanyDto, id };
    return await this.companiesService.update(id, company);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.companiesService.delete(id);
  }
}
