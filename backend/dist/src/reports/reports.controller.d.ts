import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
