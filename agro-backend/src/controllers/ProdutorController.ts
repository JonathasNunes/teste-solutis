import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ProdutorService } from '../services/ProdutorService';
import { Produtor } from '../entities/Produtor';

@Controller('produtores')
export class ProdutorController {
  private readonly logger = new Logger(ProdutorController.name);

  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  async criarProdutor(@Body() body: { cpfCnpj: string; nome: string }): Promise<Produtor> {
    this.logger.log(`Recebida requisição para criar produtor: ${JSON.stringify(body)}`);
    const produtor = await this.produtorService.cadastrarProdutor(body.cpfCnpj, body.nome);
    this.logger.log(`Produtor criado com sucesso: ID ${produtor.id}`);
    return produtor;
  }

  @Put(':id')
  async atualizarProdutor(
    @Param('id') id: number,
    @Body() body: Partial<Produtor>
  ): Promise<Produtor> {
    this.logger.log(`Recebida requisição para atualizar produtor ID ${id}: ${JSON.stringify(body)}`);
    const produtorAtualizado = await this.produtorService.atualizarProdutor(id, body);
    this.logger.log(`Produtor ID ${id} atualizado com sucesso`);
    return produtorAtualizado;
  }

  @Get()
  async listarTodos(): Promise<Produtor[]> {
    this.logger.log('Recebida requisição para listar todos os produtores');
    const produtores = await this.produtorService.listarTodos();
    this.logger.log(`Total de produtores encontrados: ${produtores.length}`);
    return produtores;
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<Produtor | undefined> {
    this.logger.log(`Recebida requisição para buscar produtor ID ${id}`);
    return this.produtorService.buscarPorId(id);
  }

  @Delete(':id')
  async excluirProdutor(@Param('id') id: number): Promise<void> {
    this.logger.log(`Recebida requisição para excluir produtor ID ${id}`);
    return this.produtorService.excluirProdutor(id);
  }
}