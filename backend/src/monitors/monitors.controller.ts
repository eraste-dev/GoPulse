
import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Request, NotFoundException } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('monitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitors')
@ApiTags('monitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MonitorsController {
    constructor(private readonly monitorsService: MonitorsService) { }

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
