export interface Company {
  company_code: string;
  company_name: string;
  level: number;
  country: string;
  city: string;
  founded_year: number;
  annual_revenue: number;
  employees: number;
}

export function isCompany(value: any): value is Company {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.company_code === 'string' &&
    typeof value.company_name === 'string' &&
    typeof value.level === 'number' &&
    typeof value.country === 'string' &&
    typeof value.city === 'string' &&
    typeof value.founded_year === 'number' &&
    typeof value.annual_revenue === 'number' &&
    typeof value.employees === 'number'
  );
}


