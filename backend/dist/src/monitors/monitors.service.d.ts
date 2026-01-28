import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
export declare class MonitorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMonitorDto: CreateMonitorDto, userId?: string): Promise<{
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateData: Partial<CreateMonitorDto>): Promise<{
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | null>;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | null>;
    checkConnectivity(url: string, timeout?: number): Promise<{
        up: boolean;
        status: number;
        latency: number;
        message: string;
    }>;
}
