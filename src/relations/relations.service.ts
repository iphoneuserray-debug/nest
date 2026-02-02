import { Injectable, OnModuleInit } from '@nestjs/common';
import { Relation } from './interfaces/relation.interface';
import { CreateRelationDto } from './dto/create-relation.dto';
import fs from 'fs';
import csvParser from 'csv-parser';

import { CompaniesService } from 'src/companies/companies.service';
import { TreeNode, buildTree } from './tree';
import { CreateFilterDto } from 'src/companies/dto/create-filter.dto';

@Injectable()
export class RelationsService implements OnModuleInit {
    private relations: Relation[] = [];
    constructor(private readonly companiesService: CompaniesService) { }

    async onModuleInit(): Promise<void> {
        const data: Relation[] = [];
        const filePath = 'test/resources/relationships_1217.csv';
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row: any) => {
                    data.push({
                        company_code: row.company_code,
                        parent_company: row.parent_company || ''
                    });
                })
                .on('end', () => resolve())
                .on('error', (err: Error) => reject(err));
        });
        this.relations = data;
    }

    findAll(): Relation[] {
        return this.relations;
    }

    findTreeByFilter(filter?: CreateFilterDto): TreeNode {
        const companies = filter ? this.companiesService.findByFilter(filter) : this.companiesService.findAll();
        const codes = new Set(companies.map((c) => c.company_code));
        const filteredRelations = this.relations.filter(
            (r) => codes.has(r.company_code)
        );
        const result = buildTree(filteredRelations);
        return result;
    }

    update(id: string, updatedRelation: CreateRelationDto) {
        const index = this.relations.findIndex((r) => r.company_code === id);
        if (index === -1) {
            const newRel = { ...updatedRelation } as Relation;
            this.relations.push(newRel);
        } else {
            this.relations[index] = updatedRelation as Relation;
        }
    }

    delete(id: string): boolean {
        const index = this.relations.findIndex((r) => r.company_code === id);
        if (index === -1) return false;
        this.relations.splice(index, 1);
        return true;
    }
}
