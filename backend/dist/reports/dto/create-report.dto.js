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
exports.CreateReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReportDto {
    monitorId;
    status;
    responseTime;
    statusCode;
    region;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clqzi...', description: 'The ID of the monitor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "monitorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UP', description: 'Status of the ping (UP/DOWN)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, description: 'Response time in ms' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, description: 'HTTP Status Code', required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'us-east-1', description: 'Source Region', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "region", void 0);
//# sourceMappingURL=create-report.dto.js.map