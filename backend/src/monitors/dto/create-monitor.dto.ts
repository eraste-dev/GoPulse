
import { IsString, IsUrl, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonitorDto {
    @ApiProperty({ example: 'Google Check', description: 'Friendly name of the monitor' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://google.com', description: 'URL to ping' })
    @IsUrl()
    url: string;

    @ApiProperty({ example: 60, description: 'Interval in seconds', required: false, default: 60 })
    @IsInt()
    @IsOptional()
    interval?: number;

    @ApiProperty({ example: 10, description: 'Timeout in seconds', required: false, default: 10 })
    @IsInt()
    @IsOptional()
    timeout?: number;

    @ApiProperty({ example: 3, description: 'Consecutive failures before alert', required: false, default: 3 })
    @IsInt()
    @IsOptional()
    threshold?: number;

    @ApiProperty({ example: ['europe', 'us'], description: 'List of regions to check from', required: false, default: ['europe'] })
    @IsOptional()
    regions?: string[];

    @ApiProperty({ example: 'GET', description: 'HTTP Method', required: false, default: 'GET' })
    @IsString()
    @IsOptional()
    method?: string;

    @ApiProperty({ example: 200, description: 'Expected HTTP Status code', required: false, default: 200 })
    @IsInt()
    @IsOptional()
    expectedStatus?: number;
}
