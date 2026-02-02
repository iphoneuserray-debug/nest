import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsInt, IsString, Min } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ type: String })
    @IsString()
    id: string;

    @ApiProperty({ type: String })
    @IsString()
    name: string;

    @ApiProperty({ type: Number })
    @IsInt()
    @Min(0)
    age: number;

    @ApiProperty({ type: String })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'role type', enum: ['Admin', 'Manager', 'User'] })
    @IsEnum(['Admin', 'Manager', 'User'])
    role: 'Admin' | 'Manager' | 'User';

    @ApiProperty({ type: String })
    @IsString()
    status: string;
}
