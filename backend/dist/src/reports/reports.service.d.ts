import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createReportDto: CreateReportDto): Promise<{
        id: string;
        status: string;
        statusCode: number;
        responseTime: number;
        errorMessage: string | null;
        region: string;
        timestamp: Date;
        monitorId: string;
    }>;
    findAll(monitorId?: string): Promise<{
        id: string;
        status: string;
        statusCode: number;
        responseTime: number;
        errorMessage: string | null;
        region: string;
        timestamp: Date;
        monitorId: string;
    }[]>;
}
