"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MonitorsService = class MonitorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMonitorDto, userId) {
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
            }
            else {
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
    findOne(id) {
        return this.prisma.monitor.findUnique({
            where: { id },
        });
    }
    async update(id, updateData) {
        try {
            return await this.prisma.monitor.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            return await this.prisma.monitor.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
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
        const downMonitors = monitors.filter((m) => m.reports[0]?.status === 'DOWN').length;
        const upMonitors = totalMonitors - downMonitors;
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
        const avgResponseTime = totalReports > 0
            ? Math.round(recentReports.reduce((sum, r) => sum + r.responseTime, 0) / totalReports)
            : 0;
        return {
            totalMonitors,
            activeMonitors: upMonitors,
            downMonitors,
            uptimePercentage,
            avgResponseTime,
        };
    }
    async getUptimeHistory(period = '24h') {
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
        const intervalMs = period === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const buckets = new Map();
        reports.forEach((report) => {
            const bucketTime = Math.floor(report.timestamp.getTime() / intervalMs) * intervalMs;
            const bucket = buckets.get(bucketTime) || { up: 0, total: 0, responseSum: 0 };
            bucket.total++;
            if (report.status === 'UP')
                bucket.up++;
            bucket.responseSum += report.responseTime;
            buckets.set(bucketTime, bucket);
        });
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
    async getMonitorHistory(monitorId, period = '24h') {
        const now = new Date();
        let startDate;
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
    async checkConnectivity(url, timeout = 5000) {
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
        }
        catch (error) {
            clearTimeout(timeoutId);
            return {
                up: false,
                status: 0,
                latency: 0,
                message: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }
};
exports.MonitorsService = MonitorsService;
exports.MonitorsService = MonitorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonitorsService);
//# sourceMappingURL=monitors.service.js.map