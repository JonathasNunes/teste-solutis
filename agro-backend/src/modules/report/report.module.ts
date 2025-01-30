import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ReportController } from '../../controllers/ReportController.js';
import { ReportRepository } from '../../repositories/ReportRepository.js';
import { ReportService } from '../../services/ReportService.js';

@Module({
    imports: [TypeOrmModule.forFeature([ReportRepository])],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
