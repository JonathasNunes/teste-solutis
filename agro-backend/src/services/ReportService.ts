import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportRepository } from '../repositories/ReportRepository';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportRepository)
        private readonly reportRepository: ReportRepository
    ) {}

    async totalFazendas(): Promise<number> {
        return this.reportRepository.countTotalFazendas();
    }

    async totalHectares(): Promise<number> {
        return this.reportRepository.getTotalHectares();
    }
}