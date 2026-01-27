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
    async create(createMonitorDto) {
        const defaultUser = await this.prisma.user.findFirst();
        if (!defaultUser) {
            const user = await this.prisma.user.create({
                data: {
                    email: 'admin@eraste.com',
                    password: 'hashedpassword123',
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
    findAll() {
        return this.prisma.monitor.findMany({
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
};
exports.MonitorsService = MonitorsService;
exports.MonitorsService = MonitorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonitorsService);
//# sourceMappingURL=monitors.service.js.map