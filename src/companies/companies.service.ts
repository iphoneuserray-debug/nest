import { Injectable, OnModuleInit } from '@nestjs/common';
import { Company } from './interfaces/company.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import fs from 'fs';
import csvParser from 'csv-parser';
import { employeeRange, getAccumulativeCompanyByYearData, getStats, levelData, levelKeys, revenueRange, yearRange } from './company-data';
import { DataCard, Doughnut, LineData, Widgets } from './interfaces/widgets.interface';
import { filterHandler } from './filterHandler';
import { CreateFilterDto } from './dto/create-filter.dto';
import { Stats } from './interfaces/stats.interface';
import { Panel } from './interfaces/panel.interface';

@Injectable()
export class CompaniesService implements OnModuleInit {
    private companies: Company[] = [];
    private stat: Stats;

    async onModuleInit(): Promise<void> {
        const data: Company[] = [];
        // Read csv file
        const filePath: string = 'test/resources/companies_1217.csv';
        await new Promise<void>((resolve, reject) => {
            const numericFields = ['level', 'founded_year', 'annual_revenue', 'employees'];
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row: any) => {
                    for (const f of numericFields) {
                        if (row[f] !== undefined) row[f] = Number(row[f]);
                    }
                    data.push(row as Company);
                })
                .on('end', () => resolve())
                .on('error', (error: Error) => {
                    console.error('An error occurred:', error.message);
                    reject(error);
                });
        });
        this.companies = data;
        this.stat = getStats(this.companies);
    }

    findAll(): Company[] {
        return this.companies;
    }

    findByFilter(filter: CreateFilterDto): Company[] {
        const result = this.companies.filter((company) => filterHandler(filter, company));
        return result;
    }

    update(id: string, updatedCompany: CreateCompanyDto) {
        const index = this.companies.findIndex((u) => u.company_code === id);
        if (index === -1) {
            const newCompany = { ...updatedCompany } as Company;
            this.companies.push(newCompany);
            this.stat = getStats(this.companies);
            return newCompany;
        } else {
            this.companies[index] = updatedCompany as Company;
            this.stat = getStats(this.companies);
            return this.companies[index];
        }
    }

    delete(id: string) {
        const index = this.companies.findIndex((u) => u.company_code === id);
        if (index === -1) return;
        this.companies.splice(index, 1);
        this.stat = getStats(this.companies);
        return true;
    }

    getWidgets(): Widgets {
        const doughnut: Doughnut = {
            levelList: levelKeys(this.stat.level),
            level: levelData(this.stat.level),
        };

        const line: LineData = getAccumulativeCompanyByYearData(this.stat.companyByYear);

        const datacard: DataCard = {
            totalCompany: this.stat.totalCompany,
            totalEmployee: this.stat.totalEmployee,
            totalRevenue: this.stat.totalRevenue,
            totalCountry: this.stat.country.size
        };

        return { datacard, doughnut, line };
    }

    getPanel(): Panel {
        return {
            level: levelKeys(this.stat.level),
            country: Array.from(this.stat.country.keys()),
            city: Array.from(this.stat.city.keys()),
            year: yearRange(this.stat.companyByYear),
            revenue: revenueRange(this.companies),
            employee: employeeRange(this.companies),
        }
    }

    // Find all rows satify the filter
    relationFiltered(filter: CreateFilterDto): Company[] {
        const result: Company[] = [];
        for (const row of this.companies) {
            if (filterHandler(filter, row)) {
                result.push(row);
            }
        }
        return result;
    }

    getLevel(): number {
        return this.stat.level.size;
    }
}
