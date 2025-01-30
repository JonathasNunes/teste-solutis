import { Controller, Get, Post, Put, Delete, Param, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CulturaService } from '../services/CulturaService.js';
import { Cultura } from '../entities/Cultura.js';

@ApiTags('Culturas')
@Controller('culturas')
export class CulturaController {
    private readonly logger = new Logger(CulturaController.name);

    constructor(private readonly culturaService: CulturaService) {}

    @Get()
    @ApiOperation({ summary: 'Listar todas as culturas' })
    @ApiResponse({ status: 200, description: 'Culturas listadas com sucesso', type: [Cultura] })
    async listarTodas(): Promise<Cultura[]> {
        this.logger.log('Requisição recebida para listar todas as culturas');
        try {
            const culturas = await this.culturaService.listarTodas();
            this.logger.log(`Culturas retornadas: ${culturas.length}`);
            return culturas;
        } catch (error) {
            this.logger.error(`Erro ao listar culturas ${JSON.stringify(error)}`);
            throw error;
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cultura por ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID da cultura' })
    @ApiResponse({ status: 200, description: 'Cultura encontrada', type: Cultura })
    @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
    async buscarPorId(@Param('id') id: number): Promise<Cultura> {
        this.logger.log(`Requisição recebida para buscar cultura com ID: ${id}`);
        try {
            const cultura = await this.culturaService.buscarPorId(id);
            if (!cultura) {
                this.logger.warn(`Nenhuma cultura encontrada com ID: ${id}`);
            }
            return cultura;
        } catch (error) {
            this.logger.error(`Erro ao buscar cultura com ID: ${id} - ${JSON.stringify(error)}`);
            throw error;
        }
    }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova cultura' })
    @ApiBody({ type: Cultura, description: 'Dados da cultura a ser criada' })
    @ApiResponse({ status: 201, description: 'Cultura criada com sucesso', type: Cultura })
    async criar(@Body() culturaData: Partial<Cultura>): Promise<Cultura> {
        this.logger.log(`Requisição recebida para criar cultura: ${JSON.stringify(culturaData)}`);
        try {
            const novaCultura = await this.culturaService.criar(culturaData);
            this.logger.log(`Cultura criada com sucesso: ${JSON.stringify(novaCultura)}`);
            return novaCultura;
        } catch (error) {
            this.logger.error(`Erro ao criar cultura - ${JSON.stringify(error)}`);
            throw error;
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Alterar cultura existente' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID da cultura' })
    @ApiBody({ type: Cultura, description: 'Dados atualizados da cultura' })
    @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso', type: Cultura })
    @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
    async alterar(@Param('id') id: number, @Body() culturaData: Partial<Cultura>): Promise<Cultura> {
        this.logger.log(`Requisição recebida para alterar cultura com ID: ${id}, dados: ${JSON.stringify(culturaData)}`);
        try {
            const culturaAtualizada = await this.culturaService.alterar(id, culturaData);
            this.logger.log(`Cultura com ID ${id} atualizada com sucesso.`);
            return culturaAtualizada;
        } catch (error) {
            this.logger.error(`Erro ao atualizar cultura com ID: ${id} - ${JSON.stringify(error)}`);
            throw error;
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar cultura por ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID da cultura' })
    @ApiResponse({ status: 204, description: 'Cultura deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
    async deletar(@Param('id') id: number): Promise<void> {
        this.logger.log(`Requisição recebida para deletar cultura com ID: ${id}`);
        try {
            await this.culturaService.deletar(id);
            this.logger.log(`Cultura com ID ${id} deletada com sucesso.`);
        } catch (error) {
            this.logger.error(`Erro ao deletar cultura com ID: ${id} - ${JSON.stringify(error)}`);
            throw error;
        }
    }
}