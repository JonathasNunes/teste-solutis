import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutorService } from '../services/ProdutorService';
import { Produtor } from '../entities/Produtor';

@Controller('produtores')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  async criarProdutor(@Body() body: { cpfCnpj: string; nome: string }): Promise<Produtor> {
    return this.produtorService.cadastrarProdutor(body.cpfCnpj, body.nome);
  }

  @Put(':id')
  async atualizarProdutor(
    @Param('id') id: number,
    @Body() body: Partial<Produtor>
  ): Promise<Produtor> {
    return this.produtorService.atualizarProdutor(id, body);
  }

  @Get()
  async listarTodos(): Promise<Produtor[]> {
    return this.produtorService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<Produtor | undefined> {
    return this.produtorService.buscarPorId(id);
  }

  @Delete(':id')
  async excluirProdutor(@Param('id') id: number): Promise<void> {
    return this.produtorService.excluirProdutor(id);
  }
}