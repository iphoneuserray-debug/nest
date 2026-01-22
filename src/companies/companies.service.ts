import { Injectable } from '@nestjs/common';
import { Company, isCompany } from './interfaces/company.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import Papa from 'papaparse';

@Injectable()
export class CompaniesService {
  private readonly companies: Company[] = [];

  constructor(){
    this.readRows();
  }
  
  // Read csv file and formate into RowData type for company spreadsheet
  private async readRows(): Promise<void> {
        const response = await fetch('/res/companies_1217.csv');
        const csvText = await response.text();

        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });
        // Copy data into rows
        result.data.map(row => {
            if(isCompany(row)){
                this.companies.push({
                    company_code: String(row.company_code),
                    company_name: String(row.company_name),
                    level: Number(row.level),
                    country: String(row.country),
                    city: String(row.city),
                    founded_year: Number(row.founded_year),
                    annual_revenue: Number(row.annual_revenue),
                    employees: Number(row.employees),
                    });
            }
        });
    }

  findAll(): Company[] {
    return this.companies;
  }

  update(id: string, updatedCompany: CreateCompanyDto) {
    const index = this.companies.findIndex((u) => u.company_code === id);
    if (index === -1) {
      const newCompany = { ...updatedCompany } as Company;
      this.companies.push(newCompany);
    } else {
      this.companies[index] = updatedCompany as Company;
    }
  }

  delete(id: string) {
    const index = this.companies.findIndex((u) => u.company_code === id);
    if (index === -1) return;
    this.companies.splice(index, 1);
  }
}
