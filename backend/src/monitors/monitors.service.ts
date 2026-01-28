
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
     * Get dashboard statistics.
     * @returns Dashboard KPIs including uptime, down count, and avg response time
     */
    async getDashboardStats() {
        const monitors = await this.prisma.monitor.findMany({
            where: { isActive: true },
            include: {
                reports: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        });

        const totalMonitors = monitors.length;
        const downMonitors = monitors.filter(
            (m) => m.reports[0]?.status === 'DOWN'
        ).length;
        const upMonitors = totalMonitors - downMonitors;

        // Calculate uptime percentage based on last 24h reports
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentReports = await this.prisma.pingReport.findMany({
            where: {
                timestamp: { gte: yesterday },
            },
        });

        const totalReports = recentReports.length;
        const upReports = recentReports.filter((r) => r.status === 'UP').length;
        const uptimePercentage = totalReports > 0
            ? Math.round((upReports / totalReports) * 10000) / 100
            : 100;

        // Calculate average response time
        const avgResponseTime = totalReports > 0
            ? Math.round(
                recentReports.reduce((sum, r) => sum + r.responseTime, 0) / totalReports
            )
            : 0;

        return {
            totalMonitors,
            activeMonitors: upMonitors,
            downMonitors,
            uptimePercentage,
            avgResponseTime,
        };
    }

    /**
     * Get uptime history for charts.
     * @param period '24h' | '7d' - Time period for history
     * @returns Array of time-series data points
     */
    async getUptimeHistory(period: '24h' | '7d' = '24h') {
        const now = new Date();
        const startDate = period === '24h'
            ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
            : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const reports = await this.prisma.pingReport.findMany({
            where: {
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'asc' },
        });

        // Group by time intervals
        const intervalMs = period === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1h or 1d
        const buckets = new Map<number, { up: number; total: number; responseSum: number }>();

        reports.forEach((report) => {
            const bucketTime = Math.floor(report.timestamp.getTime() / intervalMs) * intervalMs;
            const bucket = buckets.get(bucketTime) || { up: 0, total: 0, responseSum: 0 };

            bucket.total++;
            if (report.status === 'UP') bucket.up++;
            bucket.responseSum += report.responseTime;

            buckets.set(bucketTime, bucket);
        });

        // Convert to array with formatted data
        const history = Array.from(buckets.entries())
            .map(([timestamp, data]) => ({
                timestamp: new Date(timestamp).toISOString(),
                uptime: data.total > 0 ? Math.round((data.up / data.total) * 10000) / 100 : 100,
                avgResponseTime: data.total > 0 ? Math.round(data.responseSum / data.total) : 0,
                totalChecks: data.total,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return history;
    }

    /**
     * Get history for a specific monitor.
     * @param monitorId Monitor UUID
     * @param period '24h' | '7d' | '30d' - Time period for history
     * @returns Array of history data points
     */
    async getMonitorHistory(monitorId: string, period: '24h' | '7d' | '30d' = '24h') {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        const reports = await this.prisma.pingReport.findMany({
            where: {
                monitorId,
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'asc' },
        });

        return reports.map((report) => ({
            timestamp: report.timestamp.toISOString(),
            responseTime: report.responseTime,
            status: report.status,
            statusCode: report.statusCode,
        }));
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
