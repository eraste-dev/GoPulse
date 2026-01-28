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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorsController = void 0;
const common_1 = require("@nestjs/common");
const monitors_service_1 = require("./monitors.service");
const create_monitor_dto_1 = require("./dto/create-monitor.dto");
const update_monitor_dto_1 = require("./dto/update-monitor.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MonitorsController = class MonitorsController {
    monitorsService;
    constructor(monitorsService) {
        this.monitorsService = monitorsService;
    }
    create(createMonitorDto, req) {
        return this.monitorsService.create(createMonitorDto, req.user?.id);
    }
    findAll() {
        return this.monitorsService.findAll();
    }
    findOne(id) {
        return this.monitorsService.findOne(id);
    }
    async update(id, updateMonitorDto) {
        const monitor = await this.monitorsService.update(id, updateMonitorDto);
        if (!monitor) {
            throw new common_1.NotFoundException(`Monitor with ID ${id} not found`);
        }
        return monitor;
    }
    async remove(id) {
        const monitor = await this.monitorsService.remove(id);
        if (!monitor) {
            throw new common_1.NotFoundException(`Monitor with ID ${id} not found`);
        }
        return monitor;
    }
    testConnectivity(url) {
        return this.monitorsService.checkConnectivity(url);
    }
};
exports.MonitorsController = MonitorsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new monitor' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_monitor_dto_1.CreateMonitorDto, Object]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all monitors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one monitor by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a monitor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_monitor_dto_1.UpdateMonitorDto]),
    __metadata("design:returntype", Promise)
], MonitorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a monitor' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonitorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('test-connectivity'),
    (0, swagger_1.ApiOperation)({ summary: 'Test connectivity to a URL' }),
    __param(0, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "testConnectivity", null);
exports.MonitorsController = MonitorsController = __decorate([
    (0, swagger_1.ApiTags)('monitors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('monitors'),
    (0, swagger_1.ApiTags)('monitors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [monitors_service_1.MonitorsService])
], MonitorsController);
//# sourceMappingURL=monitors.controller.js.map