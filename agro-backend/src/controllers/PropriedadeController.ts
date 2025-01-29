import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Propriedade } from '../entities/Propriedade';
import { PropriedadeService } from '../services/PropriedadeService';
import { ProdutorService } from '../services/ProdutorService'; // Importa o serviço do Produtor
import { CulturaService } from 'src/services/CulturaService';

@Controller('propriedades')
export class PropriedadeController {
  constructor(
    private readonly propriedadeService: PropriedadeService,
    private readonly produtorService: ProdutorService,
    private readonly culturaService: CulturaService
  ) {}

  // Endpoint para cadastrar uma propriedade
  @Post()
  async cadastrarPropriedade(@Body() data: Partial<Propriedade>): Promise<Propriedade> {
    if (!data.produtor || !data.produtor.id) {
      throw new Error('O ID do produtor é obrigatório para associar uma propriedade.');
    }
  
    // Buscar o produtor pelo ID
    const produtor = await this.produtorService.buscarPorId(data.produtor.id);
    if (!produtor) {
      throw new Error('Produtor não encontrado.');
    }
  
    // Criar um objeto do tipo Propriedade corretamente
    const novaPropriedade: Propriedade = {
      ...data,
      produtor,
    } as Propriedade; // Garante que o TypeScript entenda como `Propriedade`
  
    const novaPropriedade1 = await this.propriedadeService.cadastrarPropriedade(novaPropriedade);

    // Cadastra culturas, se existirem no payload
    if (data.culturas && data.culturas.length > 0) {
      for (const cultura of data.culturas) {
        await this.culturaService.criar({
          ...cultura,
          propriedade: novaPropriedade1, // Associando a nova propriedade
        });
      }
    }
    return novaPropriedade1;
  }

  // Endpoint para listar todas as propriedades
  @Get()
  async listarTodos(): Promise<Propriedade[]> {
    return this.propriedadeService.listarTodos();
  }

  // Endpoint para buscar uma propriedade por ID
  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<Propriedade> {
    return this.propriedadeService.buscarPorId(id);
  }

  // Endpoint para buscar propriedades por produtor
  @Get('produtor/:produtorId')
  async buscarPorProdutor(@Param('produtorId') produtorId: number): Promise<Propriedade[]> {
    return this.propriedadeService.buscaPropriedadesPorProdutor(produtorId);
  }

  // Endpoint para atualizar uma propriedade
  @Put(':id')
  async atualizarPropriedade(
    @Param('id') id: number,
    @Body() data: Partial<Propriedade>
  ): Promise<Propriedade> {
    // Verifica se o produtor precisa ser atualizado
    if (data.produtor && data.produtor.id) {
      const produtor = await this.produtorService.buscarPorId(data.produtor.id);
      if (!produtor) {
        throw new Error('Produtor não encontrado.');
      }
      data.produtor = produtor; // Atualiza o relacionamento com o produtor
    }

    return this.propriedadeService.atualizarPropriedade(id, data);
  }

  // Endpoint para excluir uma propriedade
  @Delete(':id')
  async excluirPropriedade(@Param('id') id: number): Promise<void> {
    await this.propriedadeService.excluirPropriedade(id);
  }
}