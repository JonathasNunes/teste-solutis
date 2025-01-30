import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';  // Importando os decorators necessários
import { ProdutorService } from '../services/ProdutorService.js';
import { Produtor } from '../entities/Produtor.js';

@ApiTags('Produtores')  // Definindo o grupo de endpoints "Produtores"
@Controller('produtores')
export class ProdutorController {
  private readonly logger = new Logger(ProdutorController.name);

  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produtor' })
  @ApiBody({
    description: 'Dados do produtor para criação',
    type: Produtor,  // A estrutura dos dados para criação
  })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso', type: Produtor })
  async criarProdutor(@Body() body: { cpfCnpj: string; nome: string }): Promise<Produtor> {
    this.logger.log(`Recebida requisição para criar produtor: ${JSON.stringify(body)}`);
    const produtor = await this.produtorService.cadastrarProdutor(body.cpfCnpj, body.nome);
    this.logger.log(`Produtor criado com sucesso: ID ${produtor.id}`);
    return produtor;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produtor existente' })
  @ApiBody({
    description: 'Dados para atualizar o produtor',
    type: Produtor,  // Usando a entidade Produtor como estrutura de dados
  })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso', type: Produtor })
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
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores', type: [Produtor] })
  async listarTodos(): Promise<Produtor[]> {
    this.logger.log('Recebida requisição para listar todos os produtores');
    const produtores = await this.produtorService.listarTodos();
    this.logger.log(`Total de produtores encontrados: ${produtores.length}`);
    return produtores;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado', type: Produtor })
  async buscarPorId(@Param('id') id: number): Promise<Produtor | undefined> {
    this.logger.log(`Recebida requisição para buscar produtor ID ${id}`);
    return this.produtorService.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor excluído com sucesso' })
  async excluirProdutor(@Param('id') id: number): Promise<void> {
    this.logger.log(`Recebida requisição para excluir produtor ID ${id}`);
    return this.produtorService.excluirProdutor(id);
  }
}