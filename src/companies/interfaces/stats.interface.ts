export interface Stats {
    totalCompany: number;
    totalEmployee: number;
    totalRevenue: number;
    country: Map<string, number>;
    city: Map<string, number>;
    level: Map<number, number>;
    companyByYear: Map<number, number>;
};