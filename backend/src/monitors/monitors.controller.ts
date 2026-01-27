
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('monitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitors')
export class MonitorsController {
    constructor(private readonly monitorsService: MonitorsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new monitor' })
    create(@Body() createMonitorDto: CreateMonitorDto) {
        return this.monitorsService.create(createMonitorDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all monitors' })
    findAll() {
        return this.monitorsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one monitor by ID' })
    findOne(@Param('id') id: string) {
        return this.monitorsService.findOne(id);
    }
}
