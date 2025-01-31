import { Controller, Get, Post, Put, Delete, Param, Body, Logger } from '@nestjs/common';
import { CulturaService } from '../services/CulturaService';
import { Cultura } from '../entities/Cultura';

@Controller('culturas')
export class CulturaController {
    private readonly logger = new Logger(CulturaController.name);

    constructor(private readonly culturaService: CulturaService) {}

    @Get()
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