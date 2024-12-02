import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { MonitoringService } from './services/monitoring.service';

@Module({
  providers: [PrismaService, MonitoringService],
  exports: [PrismaService, MonitoringService],
})
export class CommonModule {}
