import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty({ example: 'alice@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 's3cr3t', format: 'password' })
    @IsString()
    password!: string;

    @ApiProperty({ required: false, example: '+1-555-5555' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    postcode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    about?: string;
}
