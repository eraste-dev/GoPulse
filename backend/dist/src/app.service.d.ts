import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: string;
            api: string;
        };
        version: string;
    }>;
}
