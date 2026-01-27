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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MonitorsController = class MonitorsController {
    monitorsService;
    constructor(monitorsService) {
        this.monitorsService = monitorsService;
    }
    create(createMonitorDto) {
        return this.monitorsService.create(createMonitorDto);
    }
    findAll() {
        return this.monitorsService.findAll();
    }
    findOne(id) {
        return this.monitorsService.findOne(id);
    }
};
exports.MonitorsController = MonitorsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new monitor' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_monitor_dto_1.CreateMonitorDto]),
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
exports.MonitorsController = MonitorsController = __decorate([
    (0, swagger_1.ApiTags)('monitors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('monitors'),
    __metadata("design:paramtypes", [monitors_service_1.MonitorsService])
], MonitorsController);
//# sourceMappingURL=monitors.controller.js.map