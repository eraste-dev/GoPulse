import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMonitorDto } from './create-monitor.dto';

export class UpdateMonitorDto extends PartialType(CreateMonitorDto) {
    @ApiProperty({ example: true, description: 'Whether the monitor is active', required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
