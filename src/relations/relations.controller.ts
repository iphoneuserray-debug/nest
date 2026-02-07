import { Body, Controller, Delete, Get, Param, Query, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { RelationsService } from './relations.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { TreeNode } from './tree';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('relations')
@Controller('relations')
export class RelationsController {
    constructor(private relationsService: RelationsService) { }

    @Get()
    @ApiQuery({ name: 'filter', required: false, description: 'URL-encoded JSON filter object to restrict companies' })
    @ApiOkResponse({ description: 'Tree of relations for matched companies', type: Object })
    @ApiBadRequestResponse({ description: 'Invalid filter JSON' })
    async findRelationTree(@Query('filter') filter?: string): Promise<TreeNode> {
        let filterObj: any = undefined;
        if (filter) {
            try {
                filterObj = JSON.parse(decodeURIComponent(filter));
            } catch (e) {
                throw new BadRequestException('Invalid filter');
            }
        }
        const tree = await this.relationsService.findTreeByFilter(filterObj);
        return tree;
    }

    @Get('/all')
    @ApiOkResponse({ description: 'All relations', type: CreateRelationDto, isArray: true })
    async findAll(): Promise<CreateRelationDto[]> {
        return await this.relationsService.findAll();
    }

    @Put()
    @ApiOkResponse({ description: 'Relation created or updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid relation payload' })
    async update(@Body() createRelationDto: CreateRelationDto) {
        if (!createRelationDto) {
            throw new BadRequestException();
        }
        return await this.relationsService.update(createRelationDto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Relation deleted' })
    @ApiNotFoundResponse({ description: 'Relation not found' })
    async delete(@Param('id') id: string) {
        await this.relationsService.delete(id as string);
    }
}
