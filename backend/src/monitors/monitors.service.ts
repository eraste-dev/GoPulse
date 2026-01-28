
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';

@Injectable()
export class MonitorsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new monitor.
     * @param createMonitorDto Monitor configuration data
     * @param userId The ID of the owner
     * @returns The created monitor
     */
    async create(createMonitorDto: CreateMonitorDto, userId?: string) {
        // Fallback to default user if no userId provided (for dev/seed)
        let ownerId = userId;
        if (!ownerId) {
            const defaultUser = await this.prisma.user.findFirst();
            if (!defaultUser) {
                const user = await this.prisma.user.create({
                    data: {
                        email: 'admin@eraste.com',
                        password: 'hashedpassword123',
                        name: 'Admin',
                    }
                });
                ownerId = user.id;
            } else {
                ownerId = defaultUser.id;
            }
        }

        return this.prisma.monitor.create({
            data: {
                ...createMonitorDto,
                userId: ownerId
            },
        });
    }

    /**
     * Retrieve all monitors.
     * @returns List of monitors with report counts
     */
    findAll() {
        return this.prisma.monitor.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { reports: true }
                }
            }
        });
    }

    /**
     * Find a monitor by ID.
     * @param id Monitor UUID
     * @returns The monitor or null
     */
    findOne(id: string) {
        return this.prisma.monitor.findUnique({
            where: { id },
        });
    }

    /**
     * Update a monitor.
     * @param id Monitor UUID
     * @param updateData Partial data
     * @returns Updated monitor
     */
    async update(id: string, updateData: Partial<CreateMonitorDto>) {
        try {
            return await this.prisma.monitor.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found
                return null;
            }
            throw error;
        }
    }

    /**
     * Remove a monitor.
     * @param id Monitor UUID
     * @returns Deleted monitor
     */
    async remove(id: string) {
        try {
            return await this.prisma.monitor.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }

    /**
     * Test connectivity to a URL.
     * @param url The URL to test
     * @param timeout Timeout in ms
     * @returns Status object
     */
    async checkConnectivity(url: string, timeout: number = 5000) {
        const start = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
            clearTimeout(timeoutId);
            const latency = Date.now() - start;

            return {
                up: response.ok,
                status: response.status,
                latency,
                message: response.ok ? 'Connection successful' : `HTTP Error ${response.status}`
            };
        } catch (error) {
            clearTimeout(timeoutId);
            return {
                up: false,
                status: 0,
                latency: 0,
                message: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }
}
