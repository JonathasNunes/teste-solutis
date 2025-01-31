import { Body, Controller, Delete, Get, Param, Post, Put, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Propriedade } from '../entities/Propriedade';
import { PropriedadeService } from '../services/PropriedadeService';
import { ProdutorService } from '../services/ProdutorService';
import { CulturaService } from '../services/CulturaService';

@Controller('propriedades')
export class PropriedadeController {
  private readonly logger = new Logger(PropriedadeController.name);

  constructor(
    private readonly propriedadeService: PropriedadeService,
    private readonly produtorService: ProdutorService,
    private readonly culturaService: CulturaService
  ) {}

  @Post()
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
  async listarTodos(): Promise<Propriedade[]> {
    this.logger.log('Recebida requisição para listar todas as propriedades');
    const propriedades = await this.propriedadeService.listarTodos();
    this.logger.log(`Encontradas ${propriedades.length} propriedades.`);
    return propriedades;
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<Propriedade> {
    this.logger.log(`Recebida requisição para buscar propriedade por ID: ${id}`);
    const propriedade = await this.propriedadeService.buscarPorId(id);
    if (!propriedade) {
      this.logger.warn(`Propriedade com ID ${id} não encontrada.`);
    }
    return propriedade;
  }

  @Get('produtor/:produtorId')
  async buscarPorProdutor(@Param('produtorId') produtorId: number): Promise<Propriedade[]> {
    this.logger.log(`Recebida requisição para buscar propriedades do produtor ${produtorId}`);
    const propriedades = await this.propriedadeService.buscaPropriedadesPorProdutor(produtorId);
    this.logger.log(`Encontradas ${propriedades.length} propriedades para o produtor ${produtorId}.`);
    return propriedades;
  }

  @Put(':id')
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

    if (data.culturas && data.culturas.length > 0) {
      this.logger.log(`Associando ${data.culturas.length} culturas à propriedade ${propriedadeAtualizada.id}`);
      for (const cultura of data.culturas) {
        await this.culturaService.criar({ ...cultura, propriedade: propriedadeAtualizada });
      }
    }
    return propriedadeAtualizada;
  }

  @Delete(':id')
  async excluirPropriedade(@Param('id') id: number): Promise<void> {
    this.logger.log(`Recebida requisição para excluir propriedade ${id}`);
    await this.propriedadeService.excluirPropriedade(id);
    this.logger.log(`Propriedade ${id} excluída com sucesso.`);
  }

  @Get('report/total-fazendas')
    async getTotalFazendas(): Promise<{ total: number }> {
        this.logger.log('Requisição recebida: GET /reports/total-fazendas');
        try {
            const total = await this.propriedadeService.totalFazendas();
            this.logger.log(`Total de fazendas calculado: ${total}`);
            return { total };
        } catch (error) {
            this.logger.error(`Erro ao obter total de fazendas ${JSON.stringify(error)}`);
            throw new HttpException('Erro ao obter total de fazendas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('report/total-hectares')
    async getTotalHectares(): Promise<{ total: number }> {
        this.logger.log('Requisição recebida: GET /reports/total-hectares');
        try {
            const total = await this.propriedadeService.totalHectares();
            this.logger.log(`Total de hectares calculado: ${total}`);
            return { total };
        } catch (error) {
            this.logger.error(`Erro ao obter total de hectares ${JSON.stringify(error)}`);
            throw error;
        }
  }
}