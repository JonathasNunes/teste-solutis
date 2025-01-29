import { Controller, Get } from '@nestjs/common';
import { ReportService } from '../services/ReportService';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('total-fazendas')
    async getTotalFazendas(): Promise<{ total: number }> {
        const total = await this.reportService.totalFazendas();
        return { total };
    }

    @Get('total-hectares')
    async getTotalHectares(): Promise<{ total: number }> {
        const total = await this.reportService.totalHectares();
        return { total };
    }
}