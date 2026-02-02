import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { Role } from '../interfaces/account.interface';

export class CreateAccountDto {
    @ApiProperty({ required: false, example: 'Alice' })
    @IsOptional()
    @IsString()
    name?: string;

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

    @ApiProperty({ enum: ['Admin', 'Manager', 'User'], example: 'User', required: false })
    @IsOptional()
    @IsIn(['Admin', 'Manager', 'User'])
    role?: Role;
}
