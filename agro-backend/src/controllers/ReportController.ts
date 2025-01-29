import { Controller, Get, Logger } from '@nestjs/common';
import { ReportService } from '../services/ReportService';

@Controller('reports')
export class ReportController {
    private readonly logger = new Logger(ReportController.name);

    constructor(private readonly reportService: ReportService) {}

    @Get('total-fazendas')
    async getTotalFazendas(): Promise<{ total: number }> {
        this.logger.log('Requisição recebida: GET /reports/total-fazendas');
        try {
            const total = await this.reportService.totalFazendas();
            this.logger.log(`Total de fazendas calculado: ${total}`);
            return { total };
        } catch (error) {
            this.logger.error(`Erro ao obter total de fazendas ${JSON.stringify(error)}`);
            throw error;
        }
    }

    @Get('total-hectares')
    async getTotalHectares(): Promise<{ total: number }> {
        this.logger.log('Requisição recebida: GET /reports/total-hectares');
        try {
            const total = await this.reportService.totalHectares();
            this.logger.log(`Total de hectares calculado: ${total}`);
            return { total };
        } catch (error) {
            this.logger.error(`Erro ao obter total de hectares ${JSON.stringify(error)}`);
            throw error;
        }
    }
}