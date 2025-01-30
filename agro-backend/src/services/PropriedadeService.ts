import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Propriedade } from '../entities/Propriedade.js';
import { PropriedadeRepository } from '../repositories/PropriedadeRepository.js';
import { PropriedadeValidator } from '../validators/PropriedadeValidator.js';
import { validateOrReject } from 'class-validator';

export class PropriedadeService {
  private readonly logger = new Logger(PropriedadeService.name);

  constructor(
    @InjectRepository(PropriedadeRepository)
    private readonly propriedadeRepository: PropriedadeRepository
  ) {}

  async cadastrarPropriedade(data: Propriedade): Promise<Propriedade> {
    this.logger.log(`Iniciando cadastro de propriedade: ${data.nome}`);

    const propriedade = new PropriedadeValidator();
    Object.assign(propriedade, data);

    try {
      await validateOrReject(propriedade);
    } catch (error) {
      this.logger.warn(`Dados inválidos ao cadastrar propriedade: ${JSON.stringify(data)}`);
      throw error;
    }

    if (!PropriedadeValidator.validarAreas(data.area_total, data.area_agricultavel, data.area_vegetacao)) {
      this.logger.warn(`Áreas inválidas para propriedade: ${data.nome}`);
      throw new Error('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.');
    }

    const novaPropriedade = await this.propriedadeRepository.createPropriedade({
      ...data,
      produtor: data.produtor,
    });

    this.logger.log(`Propriedade cadastrada com sucesso: ID ${novaPropriedade.id}`);
    return novaPropriedade;
  }

  async atualizarPropriedade(id: number, data: Partial<Propriedade>): Promise<Propriedade> {
    this.logger.log(`Iniciando atualização da propriedade ID: ${id}`);

    if (data.area_total && data.area_agricultavel && data.area_vegetacao) {
      if (!PropriedadeValidator.validarAreas(data.area_total, data.area_agricultavel, data.area_vegetacao)) {
        this.logger.warn(`Áreas inválidas ao atualizar propriedade ID: ${id}`);
        throw new Error('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.');
      }
    }

    const propriedadeAtualizada = await this.propriedadeRepository.updatePropriedade(id, {
      ...data,
      ...(data.produtor && { produtor: data.produtor }),
      ...(data.culturas && { culturas: data.culturas }),
    });

    this.logger.log(`Propriedade atualizada com sucesso: ID ${id}`);
    return propriedadeAtualizada;
  }

  async listarTodos(): Promise<Propriedade[]> {
    this.logger.log('Listando todas as propriedades');
    return this.propriedadeRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Propriedade> {
    this.logger.log(`Buscando propriedade por ID: ${id}`);
    const propriedade = await this.propriedadeRepository.findById(id);
    if (!propriedade) {
      this.logger.warn(`Propriedade não encontrada: ID ${id}`);
      throw new Error('Propriedade não encontrada.');
    }
    return propriedade;
  }

  async buscaPropriedadesPorProdutor(produtorId: number): Promise<Propriedade[]> {
    this.logger.log(`Buscando propriedades do produtor ID: ${produtorId}`);
    return this.propriedadeRepository.findByProdutor(produtorId);
  }

  async excluirPropriedade(id: number): Promise<void> {
    this.logger.log(`Excluindo propriedade ID: ${id}`);
    await this.propriedadeRepository.deletePropriedade(id);
    this.logger.log(`Propriedade excluída com sucesso: ID ${id}`);
  }
}
