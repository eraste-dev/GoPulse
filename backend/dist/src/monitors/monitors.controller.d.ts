import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
export declare class MonitorsController {
    private readonly monitorsService;
    constructor(monitorsService: MonitorsService);
    getDashboardStats(): Promise<{
        totalMonitors: number;
        activeMonitors: number;
        downMonitors: number;
        uptimePercentage: number;
        avgResponseTime: number;
    }>;
    getUptimeHistory(period?: '24h' | '7d'): Promise<{
        timestamp: string;
        uptime: number;
        avgResponseTime: number;
        totalChecks: number;
    }[]>;
    create(createMonitorDto: CreateMonitorDto, req: any): Promise<{
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        timeout: number;
        threshold: number;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        expectedStatus: number;
        regions: string[];
        userId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            reports: number;
        };
    } & {
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        timeout: number;
        threshold: number;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        expectedStatus: number;
        regions: string[];
        userId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__MonitorClient<{
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        timeout: number;
        threshold: number;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        expectedStatus: number;
        regions: string[];
        userId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    getMonitorHistory(id: string, period?: '24h' | '7d' | '30d'): Promise<{
        timestamp: string;
        responseTime: number;
        status: string;
        statusCode: number;
    }[]>;
    update(id: string, updateMonitorDto: UpdateMonitorDto): Promise<{
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        timeout: number;
        threshold: number;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        expectedStatus: number;
        regions: string[];
        userId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        timeout: number;
        threshold: number;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        expectedStatus: number;
        regions: string[];
        userId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    testConnectivity(url: string): Promise<{
        up: boolean;
        status: number;
        latency: number;
        message: string;
    }>;
}
