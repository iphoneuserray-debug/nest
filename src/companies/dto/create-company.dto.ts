import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({ example: 'C01' })
    @IsString()
    company_code: string;

    @ApiProperty({ example: 'Acme Corporation' })
    @IsString()
    company_name: string;

    @ApiProperty({ example: 2, description: 'Hierarchy level of the company' })
    @IsInt()
    level: number;

    @ApiProperty({ example: 'USA' })
    @IsString()
    country: string;

    @ApiProperty({ example: 'San Francisco' })
    @IsString()
    city: string;

    @ApiProperty({ example: 1999 })
    @IsInt()
    founded_year: number;

    @ApiProperty({ example: 1200000 })
    @IsNumber()
    annual_revenue: number;

    @ApiProperty({ example: 250 })
    @IsInt()
    employees: number;
}
