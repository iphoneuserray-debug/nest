import { Company } from './interfaces/company.interface';
import { Stats } from './interfaces/stats.interface';

// Compute statistics from an array of companies (replaces `updateStats`)
export function getStats(rows: Company[]): Stats {
    let totalCompany = 0;
    let totalEmployee = 0;
    let totalRevenue = 0;
    const country = new Map<string, number>();
    const city = new Map<string, number>();
    const level = new Map<number, number>();
    const companyByYear = new Map<number, number>();

    for (const row of rows) {
        totalCompany++;
        totalEmployee += row.employees;
        totalRevenue += row.annual_revenue;
        countMap(row.country, country);
        countMap(row.city, city);
        countMap(row.level, level);
        countMap(row.founded_year, companyByYear);
    }

    return {
        totalCompany,
        totalEmployee,
        totalRevenue,
        country,
        city,
        level,
        companyByYear,
    };
}

// Count values stored in Map
function countMap<K>(key: K, map: Map<K, number>): Map<K, number> {
    if (!map.has(key)) map.set(key, 1);
    else map.set(key, (map.get(key)!) + 1);
    return map;
}

// Fill missing years between min and max
function addMissingYear(companyByYear: Map<number, number>): { min: number; max: number } {
    if (companyByYear.size === 0) {
        return { min: 0, max: 0 };
    }
    // Find minimum and maximum year
    const years = Array.from(companyByYear.keys()).sort((a, b) => a - b);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Fulfill every year data between min and max
    for (let year = minYear; year <= maxYear; year++) {
        if (!companyByYear.has(year)) {
            companyByYear.set(year, 0);
        }
    }

    return { min: minYear, max: maxYear };
}

/**
 * Add year not include in row data
 * Formate company count each year into accumulative array
 * @param companyByYear
 * @returns x and y coordinates in two sets of array
 */
export function getAccumulativeCompanyByYearData(companyByYear: Map<number, number>): { yearList: string[]; companyByYear: number[] } {
    // Ensure missing years between min and max are present with zero count
    addMissingYear(companyByYear);
    const years = Array.from(companyByYear.keys()).sort((a, b) => a - b);

    const yearList: string[] = [];
    const companyByYearArr: number[] = [];
    let cumulative = 0;

    for (const year of years) {
        cumulative += companyByYear.get(year)!;
        yearList.push(year.toString());
        companyByYearArr.push(cumulative);
    }

    return { yearList, companyByYear: companyByYearArr };
}

export function levelKeys(levelMap: Map<number, number>): number[] {
    return Array.from(levelMap.keys()).sort((a, b) => a - b);
}

export function levelData(levelMap: Map<number, number>): number[] {
    const array = levelKeys(levelMap);
    const data = new Array<number>();
    for (const key of array) {
        if (levelMap.has(key)) data.push(levelMap.get(key)!);
    }
    return data;
}

// Find numberic feilds max and min value
function numericRange(rows: Company[], accessor: (c: Company) => number): { min: number; max: number } {
    return rows.reduce(
        (res, row) => {
            const v = accessor(row);
            res.min = Math.min(res.min, v);
            res.max = Math.max(res.max, v);
            return res;
        },
        { min: Infinity, max: -Infinity },
    );
}

export function revenueRange(rows: Company[]): { min: number; max: number } {
    return numericRange(rows, (r) => r.annual_revenue);
}

export function employeeRange(rows: Company[]): { min: number; max: number } {
    return numericRange(rows, (r) => r.employees);
}

export function yearRange(companyByYear: Map<number, number>): { min: number; max: number } {
    const years = Array.from(companyByYear.keys()).sort((a, b) => a - b);
    if (years.length === 0) return { min: 0, max: 0 };
    return { min: years[0], max: years[years.length - 1] };
}
