import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Relation } from './entity/relation.entity';
import { CreateRelationDto } from './dto/create-relation.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { TreeNode, buildTree } from './tree';
import { CreateFilterDto } from 'src/companies/dto/create-filter.dto';

@Injectable()
export class RelationsService {
    constructor(
        private readonly companiesService: CompaniesService,
        @InjectRepository(Relation)
        private readonly relationsRepository: Repository<Relation>,
    ) { }

    async findAll(): Promise<Relation[]> {
        return this.relationsRepository.find();
    }

    async findTreeByFilter(filter?: CreateFilterDto): Promise<TreeNode> {
        const companies = await this.companiesService.findByFilter(filter ?? {});
        const codes = companies.map((c) => c.company_code);
        if (!codes.length) return buildTree([]);
        const relations = await this.relationsRepository.find({
            where: { company_code: In(codes) },
        });
        const result = buildTree(relations);
        return result;
    }

    async update(payload: CreateRelationDto): Promise<Relation> {
        const existing = await this.relationsRepository.findOneBy({ company_code: payload.company_code });
        if (!existing) {
            const created = this.relationsRepository.create(payload as Relation);
            return this.relationsRepository.save(created);
        }
        const merged = this.relationsRepository.merge(existing, payload as Relation);
        return this.relationsRepository.save(merged);
    }

    async delete(id: string): Promise<void> {
        const affected = (await this.relationsRepository.delete({ company_code: id })).affected;
        if (affected === 0) throw new NotFoundException;
    }
}
