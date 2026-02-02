export interface Panel {
    level: number[];
    country: string[];
    city: string[];
    year: { min: number; max: number };
    revenue: { min: number; max: number };
    employee: { min: number; max: number };
};