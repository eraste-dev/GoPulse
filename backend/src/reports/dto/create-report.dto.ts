
import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
    @ApiProperty({ example: 'clqzi...', description: 'The ID of the monitor' })
    @IsString()
    monitorId: string;

    @ApiProperty({ example: 'UP', description: 'Status of the ping (UP/DOWN)' })
    @IsString()
    status: string;

    @ApiProperty({ example: 120, description: 'Response time in ms' })
    @IsNumber()
    responseTime: number;

    @ApiProperty({ example: 200, description: 'HTTP Status Code', required: false })
    @IsInt()
    @IsOptional()
    statusCode?: number;

    @ApiProperty({ example: 'us-east-1', description: 'Source Region', required: false })
    @IsString()
    @IsOptional()
    region?: string;
}
