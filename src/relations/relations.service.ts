import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Relation } from './entity/relation.entity';
import { CreateRelationDto } from './dto/create-relation.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { TreeNode, buildTree, trimTree } from './tree';
import { CreateFilterDto } from 'src/companies/dto/create-filter.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RelationsService {
    constructor(
        private readonly companiesService: CompaniesService,
        @InjectRepository(Relation)
        private readonly relationsRepository: Repository<Relation>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findAll(): Promise<Relation[]> {
        return this.relationsRepository.find();
    }

    /**
     * Get the full relation tree (cached) and optionally trim it by company filter.
     */
    async findTreeByFilter(filter?: CreateFilterDto): Promise<TreeNode> {
        // Store complete relation tree into cache
        let cached: TreeNode | undefined = await this.cacheManager.get('tree');
        if (!cached) {
            cached = buildTree(await this.findAll());
            await this.cacheManager.set('tree', cached, 100000);
        }
        // Trim branches by filter
        if (filter) {
            const filtered = await this.companiesService.findByFilter(filter);
            const codes = filtered.map((c) => c.company_code);
            return trimTree(cached, codes);
        }
        return cached;
    }

    async update(payload: CreateRelationDto): Promise<Relation> {
        const existing = await this.relationsRepository.findOneBy({ company_code: payload.company_code });
        await this.cacheManager.del('tree');
        // Add relation when not existing
        if (!existing) {
            const created = this.relationsRepository.create(payload as Relation);
            return this.relationsRepository.save(created);
        }
        // Merge relation when existing
        const merged = this.relationsRepository.merge(existing, payload as Relation);
        return this.relationsRepository.save(merged);
    }

    async delete(id: string): Promise<void> {
        const affected = (await this.relationsRepository.delete({ company_code: id })).affected;
        await this.cacheManager.del('tree');
        if (affected === 0) throw new NotFoundException;
    }
}
