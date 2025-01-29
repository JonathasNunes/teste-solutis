import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CulturaService } from '../services/CulturaService';
import { Cultura } from '../entities/Cultura';

@Controller('culturas')
export class CulturaController {
    constructor(private readonly culturaService: CulturaService) {}

    @Get()
    async listarTodas(): Promise<Cultura[]> {
        return this.culturaService.listarTodas();
    }

    @Get(':id')
    async buscarPorId(@Param('id') id: number): Promise<Cultura> {
        return this.culturaService.buscarPorId(id);
    }

    @Post()
    async criar(@Body() culturaData: Partial<Cultura>): Promise<Cultura> {
        return this.culturaService.criar(culturaData);
    }

    @Put(':id')
    async alterar(@Param('id') id: number, @Body() culturaData: Partial<Cultura>): Promise<Cultura> {
        return this.culturaService.alterar(id, culturaData);
    }

    @Delete(':id')
    async deletar(@Param('id') id: number): Promise<void> {
        await this.culturaService.deletar(id);
    }
}
