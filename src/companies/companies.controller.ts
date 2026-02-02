import type { Company } from './interfaces/company.interface';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Query, BadRequestException, HttpException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Widgets } from './interfaces/widgets.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiTags, ApiQuery, ApiNoContentResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Panel } from './interfaces/panel.interface';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
    constructor(private companiesService: CompaniesService) { }

    @Get()
    @ApiQuery({ name: 'filter', required: false, description: 'URL-encoded JSON filter object' })
    @ApiOkResponse({ description: 'Companies matching filter', type: CreateCompanyDto, isArray: true })
    @ApiNoContentResponse({ description: 'No companies matched the filter' })
    @ApiBadRequestResponse({ description: 'Invalid filter format' })
    @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
    async findByFilter(@Query('filter') filter?: string): Promise<Company[]> {
        let filterObj: any = undefined;
        if (filter) {
            try {
                filterObj = JSON.parse(decodeURIComponent(filter));
            } catch (e) {
                throw new BadRequestException('Invalid filter JSON');
            }
        }

        const result = filterObj ? await this.companiesService.findByFilter(filterObj) : this.companiesService.findAll();
        if (!result || result.length === 0) {
            throw new HttpException('No content', HttpStatus.NO_CONTENT);
        }
        return result;
    }

    @Put(':id')
    @ApiOkResponse({ description: 'Returns the updated company object', type: CreateCompanyDto })
    @ApiBadRequestResponse({ description: 'Invalid request body or parameters' })
    async update(@Param('id') id: string, @Body() createCompanyDto: CreateCompanyDto) {
        const company = { company_code: id, ...createCompanyDto } as Company;
        return await this.companiesService.update(id, company);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Company deleted successfully' })
    @ApiNotFoundResponse({ description: 'Company with given id was not found' })
    async delete(@Param('id') id: string) {
        const result = await this.companiesService.delete(id);
        if (!result) throw new NotFoundException('Company not found');
        return { deleted: true };
    }

    @Get('/widgets')
    @ApiOkResponse({ description: 'Returns widgets data (doughnut, line, datacard)', type: Object })
    async datacard(): Promise<Widgets> {
        return await this.companiesService.getWidgets();
    }

    @Get('/panel')
    @ApiOkResponse({ description: 'Returns panel options (levels, countries, cities, ranges)', type: Object })
    async panel(): Promise<Panel> {
        return await this.companiesService.getPanel();
    }

    @Get('/level')
    @ApiOkResponse({ description: 'Returns number of company levels', type: Number })
    level(): number {
        return this.companiesService.getLevel();
    }
}
