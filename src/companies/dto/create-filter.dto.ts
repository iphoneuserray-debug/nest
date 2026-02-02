export class RangeDto {
    min!: number;
    max!: number;
}

export class CreateFilterDto {
    level?: number[];
    country?: string[];
    city?: string[];
    founded_year?: RangeDto;
    annual_revenue?: RangeDto;
    employees?: RangeDto;
}