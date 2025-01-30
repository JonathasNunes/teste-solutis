import { Body, Controller, Delete, Get, Param, Post, Put, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Propriedade } from '../entities/Propriedade.js';
import { PropriedadeService } from '../services/PropriedadeService.js';
import { ProdutorService } from '../services/ProdutorService.js';
import { CulturaService } from '../services/CulturaService.js';

@ApiTags('Propriedades')  // Agrupando os endpoints no Swagger
@Controller('propriedades')
export class PropriedadeController {
  private readonly logger = new Logger(PropriedadeController.name);

  constructor(
    private readonly propriedadeService: PropriedadeService,
    private readonly produtorService: ProdutorService,
    private readonly culturaService: CulturaService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova propriedade' })
  @ApiBody({
    description: 'Dados da propriedade a ser cadastrada',
    type: Propriedade,  // Tipo da entidade Propriedade para o Swagger entender a estrutura de dados
  })
  @ApiResponse({ status: 201, description: 'Propriedade cadastrada com sucesso', type: Propriedade })
  async cadastrarPropriedade(@Body() data: Partial<Propriedade>): Promise<Propriedade> {
    this.logger.log(`Recebida requisição para cadastrar propriedade: ${JSON.stringify(data)}`);
    
    if (!data.produtor || !data.produtor.id) {
      this.logger.warn('Tentativa de cadastro sem ID do produtor');
      throw new Error('O ID do produtor é obrigatório para associar uma propriedade.');
    }

    const produtor = await this.produtorService.buscarPorId(data.produtor.id);
    if (!produtor) {
      this.logger.warn(`Produtor com ID ${data.produtor.id} não encontrado.`);
      throw new Error('Produtor não encontrado.');
    }

    const novaPropriedade: Propriedade = { ...data, produtor } as Propriedade;
    const novaPropriedade1 = await this.propriedadeService.cadastrarPropriedade(novaPropriedade);
    this.logger.log(`Propriedade cadastrada com sucesso: ${JSON.stringify(novaPropriedade1)}`);

    if (data.culturas && data.culturas.length > 0) {
      this.logger.log(`Associando ${data.culturas.length} culturas à propriedade ${novaPropriedade1.id}`);
      for (const cultura of data.culturas) {
        await this.culturaService.criar({ ...cultura, propriedade: novaPropriedade1 });
      }
    }

    return novaPropriedade1;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as propriedades' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades', type: [Propriedade] })
  async listarTodos(): Promise<Propriedade[]> {
    this.logger.log('Recebida requisição para listar todas as propriedades');
    const propriedades = await this.propriedadeService.listarTodos();
    this.logger.log(`Encontradas ${propriedades.length} propriedades.`);
    return propriedades;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma propriedade por ID' })
  @ApiResponse({ status: 200, description: 'Propriedade encontrada', type: Propriedade })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  async buscarPorId(@Param('id') id: number): Promise<Propriedade> {
    this.logger.log(`Recebida requisição para buscar propriedade por ID: ${id}`);
    const propriedade = await this.propriedadeService.buscarPorId(id);
    if (!propriedade) {
      this.logger.warn(`Propriedade com ID ${id} não encontrada.`);
    }
    return propriedade;
  }

  @Get('produtor/:produtorId')
  @ApiOperation({ summary: 'Buscar propriedades por ID do produtor' })
  @ApiResponse({ status: 200, description: 'Lista de propriedades para o produtor', type: [Propriedade] })
  async buscarPorProdutor(@Param('produtorId') produtorId: number): Promise<Propriedade[]> {
    this.logger.log(`Recebida requisição para buscar propriedades do produtor ${produtorId}`);
    const propriedades = await this.propriedadeService.buscaPropriedadesPorProdutor(produtorId);
    this.logger.log(`Encontradas ${propriedades.length} propriedades para o produtor ${produtorId}.`);
    return propriedades;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma propriedade existente' })
  @ApiBody({
    description: 'Dados para atualizar a propriedade',
    type: Propriedade,
  })
  @ApiResponse({ status: 200, description: 'Propriedade atualizada com sucesso', type: Propriedade })
  async atualizarPropriedade(@Param('id') id: number, @Body() data: Partial<Propriedade>): Promise<Propriedade> {
    this.logger.log(`Recebida requisição para atualizar propriedade ${id}: ${JSON.stringify(data)}`);
    
    if (data.produtor && data.produtor.id) {
      const produtor = await this.produtorService.buscarPorId(data.produtor.id);
      if (!produtor) {
        this.logger.warn(`Produtor com ID ${data.produtor.id} não encontrado ao tentar atualizar propriedade.`);
        throw new Error('Produtor não encontrado.');
      }
      data.produtor = produtor;
    }
    
    const propriedadeAtualizada = await this.propriedadeService.atualizarPropriedade(id, data);
    this.logger.log(`Propriedade ${id} atualizada com sucesso.`);
    return propriedadeAtualizada;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma propriedade por ID' })
  @ApiResponse({ status: 200, description: 'Propriedade excluída com sucesso' })
  async excluirPropriedade(@Param('id') id: number): Promise<void> {
    this.logger.log(`Recebida requisição para excluir propriedade ${id}`);
    await this.propriedadeService.excluirPropriedade(id);
    this.logger.log(`Propriedade ${id} excluída com sucesso.`);
  }
}