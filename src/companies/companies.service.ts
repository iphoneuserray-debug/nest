import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Company } from './entity/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { employeeRange, getAccumulativeCompanyByYearData, getStats, levelData, levelKeys, revenueRange, yearRange } from './company-data';
import { DataCard, Doughnut, LineData, Widgets } from './interfaces/widgets.interface';
import { CreateFilterDto } from './dto/create-filter.dto';
import { Stats } from './interfaces/stats.interface';
import { Panel } from './interfaces/panel.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companiesRepository: Repository<Company>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findByFilter(filter?: CreateFilterDto): Promise<Company[]> {
        if (!filter || Object.keys(filter).length === 0) {
            let result: Company[] | undefined = await this.cacheManager.get('companies');
            if (!result) {
                result = await this.companiesRepository.find();
                await this.cacheManager.set('companies', result, 10000);
            }
            return result;
        }
        const where: any = {};

        if (filter.level?.length) where.level = In(filter.level);
        if (filter.country?.length) where.country = In(filter.country);
        if (filter.city?.length) where.city = In(filter.city);

        const applyRange = (key: keyof Company, range?: { min?: number; max?: number }) => {
            if (!range) return;
            if (range.min !== undefined && range.max !== undefined) {
                where[key] = Between(range.min, range.max);
            } else if (range.min !== undefined) {
                where[key] = MoreThanOrEqual(range.min);
            } else if (range.max !== undefined) {
                where[key] = LessThanOrEqual(range.max);
            }
        };

        applyRange('founded_year', filter.founded_year);
        applyRange('annual_revenue', filter.annual_revenue);
        applyRange('employees', filter.employees);

        return this.companiesRepository.find({ where });
    }

    async update(updatedCompany: CreateCompanyDto): Promise<Company> {
        const existing = await this.companiesRepository.findOneBy({ company_code: updatedCompany.company_code });
        await this.cacheManager.del('companies');
        await this.cacheManager.del('stat');
        if (!existing) {
            return await this.companiesRepository.save(updatedCompany);
        }
        const merged = this.companiesRepository.merge(existing, updatedCompany as Company);
        return await this.companiesRepository.save(merged);
    }

    async delete(id: string): Promise<void> {
        const affected = (await this.companiesRepository.delete({ company_code: id })).affected;
        if (affected === 0) throw new NotFoundException;
        await this.cacheManager.del('companies');
        await this.cacheManager.del('stat');
    }

    async getWidgets(): Promise<Widgets> {
        let stat: Stats | undefined = await this.cacheManager.get('stat');
        if (!stat) {
            stat = getStats(await this.findByFilter());
            await this.cacheManager.set('stat', stat, 10000);
        }

        const doughnut: Doughnut = {
            levelList: levelKeys(stat.level),
            level: levelData(stat.level),
        };

        const line: LineData = getAccumulativeCompanyByYearData(stat.companyByYear);

        const datacard: DataCard = {
            totalCompany: stat.totalCompany,
            totalEmployee: stat.totalEmployee,
            totalRevenue: stat.totalRevenue,
            totalCountry: stat.country.size
        };

        return { datacard, doughnut, line };
    }

    async getPanel(): Promise<Panel> {
        const companies = await this.findByFilter();
        let stat: Stats | undefined = await this.cacheManager.get('stat');
        if (!stat) {
            stat = getStats(companies);
            await this.cacheManager.set('stat', stat, 10000);
        }
        return {
            level: levelKeys(stat.level),
            country: Array.from(stat.country.keys()),
            city: Array.from(stat.city.keys()),
            year: yearRange(stat.companyByYear),
            revenue: revenueRange(companies),
            employee: employeeRange(companies),
        }
    }

    async getLevel(): Promise<number> {
        let stat: Stats | undefined = await this.cacheManager.get('stat');
        if (!stat) {
            stat = getStats(await this.findByFilter());
            await this.cacheManager.set('stat', stat, 10000);
        }
        return stat.level.size;
    }
}