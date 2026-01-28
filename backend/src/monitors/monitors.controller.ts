
import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Request, NotFoundException, Query } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('monitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitors')
export class MonitorsController {
    constructor(private readonly monitorsService: MonitorsService) { }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    getDashboardStats() {
        return this.monitorsService.getDashboardStats();
    }

    @Get('dashboard/history')
    @ApiOperation({ summary: 'Get uptime history for charts' })
    @ApiQuery({ name: 'period', enum: ['24h', '7d'], required: false })
    getUptimeHistory(@Query('period') period: '24h' | '7d' = '24h') {
        return this.monitorsService.getUptimeHistory(period);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new monitor' })
    create(@Body() createMonitorDto: CreateMonitorDto, @Request() req: any) {
        // req.user should be populated by JwtAuthGuard
        return this.monitorsService.create(createMonitorDto, req.user?.id);
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

    @Get(':id/history')
    @ApiOperation({ summary: 'Get monitor history' })
    @ApiQuery({ name: 'period', enum: ['24h', '7d', '30d'], required: false })
    getMonitorHistory(
        @Param('id') id: string,
        @Query('period') period: '24h' | '7d' | '30d' = '24h'
    ) {
        return this.monitorsService.getMonitorHistory(id, period);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a monitor' })
    async update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
        const monitor = await this.monitorsService.update(id, updateMonitorDto);
        if (!monitor) {
            throw new NotFoundException(`Monitor with ID ${id} not found`);
        }
        return monitor;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a monitor' })
    async remove(@Param('id') id: string) {
        const monitor = await this.monitorsService.remove(id);
        if (!monitor) {
            throw new NotFoundException(`Monitor with ID ${id} not found`);
        }
        return monitor;
    }

    @Post('test-connectivity')
    @ApiOperation({ summary: 'Test connectivity to a URL' })
    testConnectivity(@Body('url') url: string) {
        return this.monitorsService.checkConnectivity(url);
    }
}
