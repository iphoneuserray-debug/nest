import type { Company } from './entity/company.entity';
import { Body, Controller, Delete, Get, HttpStatus, Param, Put, Query, BadRequestException, HttpException } from '@nestjs/common';
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

        const result = await this.companiesService.findByFilter(filterObj ?? {});
        if (!result || result.length === 0) {
            throw new HttpException('No content', HttpStatus.NO_CONTENT);
        }
        return result;
    }

    @Put()
    @ApiOkResponse({ description: 'Returns the updated company object', type: CreateCompanyDto })
    @ApiBadRequestResponse({ description: 'Invalid request body or parameters' })
    async update(@Body() createCompanyDto: CreateCompanyDto) {
        if (!createCompanyDto) throw new BadRequestException();
        return await this.companiesService.update(createCompanyDto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Company deleted successfully' })
    @ApiNotFoundResponse({ description: 'Company with given id was not found' })
    async delete(@Param('id') id: string) {
        await this.companiesService.delete(id);
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
    async level(): Promise<number> {
        return await this.companiesService.getLevel();
    }
}
