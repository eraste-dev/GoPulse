
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new ping report.
     * @param createReportDto Report data payload
     * @returns The created report
     */
    async create(createReportDto: CreateReportDto) {
        const { monitorId, status, responseTime, statusCode, region } = createReportDto;

        return this.prisma.pingReport.create({
            data: {
                monitorId,
                status,
                responseTime,
                statusCode: statusCode ?? 0,
                region: region || 'default',
                timestamp: new Date(),
            },
        });
    }

    /**
     * Get recent reports.
     * @param monitorId Optional monitor ID filter
     * @returns List of recent reports
     */
    async findAll(monitorId?: string) {
        if (monitorId) {
            return this.prisma.pingReport.findMany({
                where: { monitorId },
                orderBy: { timestamp: 'desc' },
                take: 100,
            });
        }
        return this.prisma.pingReport.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100,
            include: { monitor: true }
        });
    }
}
