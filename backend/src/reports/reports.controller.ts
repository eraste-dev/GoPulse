
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a ping report' })
    @ApiResponse({ status: 201, description: 'The report has been successfully created.' })
    create(@Body() createReportDto: CreateReportDto) {
        return this.reportsService.create(createReportDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get recent reports' })
    findAll(@Query('monitorId') monitorId?: string) {
        return this.reportsService.findAll(monitorId);
    }
}
