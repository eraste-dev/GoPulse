import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
export declare class MonitorsController {
    private readonly monitorsService;
    constructor(monitorsService: MonitorsService);
    create(createMonitorDto: CreateMonitorDto, req: any): Promise<{
        name: string;
        url: string;
        interval: number;
        timeout: number;
        threshold: number;
        regions: string[];
        method: string;
        expectedStatus: number;
        isActive: boolean;
        id: string;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            reports: number;
        };
    } & {
        name: string;
        url: string;
        interval: number;
        timeout: number;
        threshold: number;
        regions: string[];
        method: string;
        expectedStatus: number;
        isActive: boolean;
        id: string;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__MonitorClient<{
        name: string;
        url: string;
        interval: number;
        timeout: number;
        threshold: number;
        regions: string[];
        method: string;
        expectedStatus: number;
        isActive: boolean;
        id: string;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateMonitorDto: UpdateMonitorDto): Promise<{
        name: string;
        url: string;
        interval: number;
        timeout: number;
        threshold: number;
        regions: string[];
        method: string;
        expectedStatus: number;
        isActive: boolean;
        id: string;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        url: string;
        interval: number;
        timeout: number;
        threshold: number;
        regions: string[];
        method: string;
        expectedStatus: number;
        isActive: boolean;
        id: string;
        headers: import("@prisma/client/runtime/library").JsonValue | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    testConnectivity(url: string): Promise<{
        up: boolean;
        status: number;
        latency: number;
        message: string;
    }>;
}
