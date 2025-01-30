import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportService } from '../services/ReportService.js';

@ApiTags('Relatórios')
@Controller('reports')
export class ReportController {
    private readonly logger = new Logger(ReportController.name);

    constructor(private readonly reportService: ReportService) {}

    @Get('total-fazendas')
    @ApiOperation({ summary: 'Obter total de fazendas' })
    @ApiResponse({ status: 200, description: 'Total de fazendas calculado', type: Object })
    @ApiResponse({ status: 500, description: 'Erro ao obter total de fazendas' })
    async getTotalFazendas(): Promise<{ total: number }> {
        this.logger.log('Requisição recebida: GET /reports/total-fazendas');
        try {
            const total = await this.reportService.totalFazendas();
            this.logger.log(`Total de fazendas calculado: ${total}`);
            return { total };
        } catch (error) {
            this.logger.error(`Erro ao obter total de fazendas ${JSON.stringify(error)}`);
            throw new HttpException('Erro ao obter total de fazendas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('total-hectares')
    @ApiOperation({ summary: 'Obter total de hectares' })
    @ApiResponse({ status: 200, description: 'Total de hectares calculado', type: Object })
    @ApiResponse({ status: 500, description: 'Erro ao obter total de hectares' })
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