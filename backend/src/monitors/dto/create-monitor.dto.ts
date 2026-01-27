
import { IsString, IsUrl, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonitorDto {
    @ApiProperty({ example: 'Google Check', description: 'Name of the monitor' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://google.com', description: 'URL to ping' })
    @IsUrl()
    url: string;

    @ApiProperty({ example: 60, description: 'Interval in seconds', required: false, default: 60 })
    @IsInt()
    @IsOptional()
    interval?: number;
}
