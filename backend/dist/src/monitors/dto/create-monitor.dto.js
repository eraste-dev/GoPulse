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
exports.CreateMonitorDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMonitorDto {
    name;
    url;
    interval;
    timeout;
    threshold;
    regions;
    method;
    expectedStatus;
}
exports.CreateMonitorDto = CreateMonitorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Google Check', description: 'Friendly name of the monitor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMonitorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://google.com', description: 'URL to ping' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateMonitorDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60, description: 'Interval in seconds', required: false, default: 60 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMonitorDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Timeout in seconds', required: false, default: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMonitorDto.prototype, "timeout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Consecutive failures before alert', required: false, default: 3 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMonitorDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['europe', 'us'], description: 'List of regions to check from', required: false, default: ['europe'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMonitorDto.prototype, "regions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GET', description: 'HTTP Method', required: false, default: 'GET' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMonitorDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, description: 'Expected HTTP Status code', required: false, default: 200 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMonitorDto.prototype, "expectedStatus", void 0);
//# sourceMappingURL=create-monitor.dto.js.map