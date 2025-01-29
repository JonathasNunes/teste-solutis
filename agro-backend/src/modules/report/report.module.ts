import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ReportController } from 'src/controllers/ReportController';
import { ReportRepository } from 'src/repositories/ReportRepository';
import { ReportService } from 'src/services/ReportService';

@Module({
    imports: [TypeOrmModule.forFeature([ReportRepository])],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
