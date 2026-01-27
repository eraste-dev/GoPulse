import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { MonitorsModule } from './monitors/monitors.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ReportsModule, MonitorsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
