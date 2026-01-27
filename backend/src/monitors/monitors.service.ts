
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';

@Injectable()
export class MonitorsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new monitor.
     * @param createMonitorDto Monitor configuration data
     * @returns The created monitor
     */
    async create(createMonitorDto: CreateMonitorDto) {
        // Find default user (first one) or throw error for demo
        const defaultUser = await this.prisma.user.findFirst();
        if (!defaultUser) {
            // Create a default user if none exists
            const user = await this.prisma.user.create({
                data: {
                    email: 'admin@eraste.com',
                    password: 'hashedpassword123', // Demo only
                    name: 'Admin',
                }
            });
            return this.prisma.monitor.create({
                data: {
                    ...createMonitorDto,
                    userId: user.id
                }
            });
        }

        return this.prisma.monitor.create({
            data: {
                ...createMonitorDto,
                userId: defaultUser.id
            },
        });
    }

    /**
     * Retrieve all monitors.
     * @returns List of monitors with report counts
     */
    findAll() {
        return this.prisma.monitor.findMany({
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
}
