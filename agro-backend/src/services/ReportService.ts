import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportRepository } from '../repositories/ReportRepository';

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);

    constructor(
        @InjectRepository(ReportRepository)
        private readonly reportRepository: ReportRepository
    ) {}

    async totalFazendas(): Promise<number> {
        this.logger.log('Iniciando consulta para total de fazendas');
        return this.reportRepository.countTotalFazendas();
    }

    async totalHectares(): Promise<number> {
        this.logger.log('Iniciando consulta para total de hectares');
        return this.reportRepository.getTotalHectares();
    }
}