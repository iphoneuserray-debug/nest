import { Body, Controller, Delete, Get, Param, Put, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { RelationsService } from './relations.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { TreeNode } from './tree';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiQuery, ApiNoContentResponse } from '@nestjs/swagger';

@ApiTags('relations')
@Controller('relations')
export class RelationsController {
    constructor(private relationsService: RelationsService) { }

    @Get()
    @ApiQuery({ name: 'filter', required: false, description: 'URL-encoded JSON filter object to restrict companies' })
    @ApiOkResponse({ description: 'Tree of relations for matched companies', type: Object })
    @ApiBadRequestResponse({ description: 'Invalid filter JSON' })
    @ApiNoContentResponse({ description: 'No relations available for the provided filter' })
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
        if (!tree) throw new NotFoundException();
        return tree;
    }

    @Put(':id')
    @ApiOkResponse({ description: 'Relation updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid relation payload' })
    async update(@Param('id') id: string, @Body() createRelationDto: CreateRelationDto) {
        if (!createRelationDto || createRelationDto.parent_company === undefined) throw new BadRequestException();
        const rel = { ...createRelationDto, company_code: id };
        await this.relationsService.update(id, rel as any);
        return { ok: true };
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Relation deleted' })
    @ApiNotFoundResponse({ description: 'Relation not found' })
    async delete(@Param('id') id: string) {
        const res = this.relationsService.delete(id as string);
        if (!res) throw new NotFoundException('Relation not found');
        return { deleted: true };
    }
}
