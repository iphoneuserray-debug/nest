import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRelationDto {
    @ApiProperty({ example: 'C123' })
    @IsString()
    company_code: string;

    @ApiProperty({ example: 'C1234' })
    @IsString()
    parent_company: string;
}
