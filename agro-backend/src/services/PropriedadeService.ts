import { InjectRepository } from '@nestjs/typeorm';
import { Propriedade } from '../entities/Propriedade';
import { PropriedadeRepository } from '../repositories/PropriedadeRepository';
import { PropriedadeValidator } from '../validators/PropriedadeValidator';
import { validateOrReject } from 'class-validator';

export class PropriedadeService {
  constructor(
    @InjectRepository(PropriedadeRepository)
    private readonly propriedadeRepository: PropriedadeRepository
  ) {}

  async cadastrarPropriedade(data: Propriedade): Promise<Propriedade> {
    
    const propriedade = new PropriedadeValidator();
    Object.assign(propriedade, data);
    await validateOrReject(propriedade);

    if (!PropriedadeValidator.validarAreas(data.area_total, data.area_agricultavel, data.area_vegetacao)) {
      throw new Error('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.');
    }

    return this.propriedadeRepository.createPropriedade({
      ...data,
      produtor: data.produtor, // Relacionamento com Produtor
    });
  }

  async atualizarPropriedade(id: number, data: Partial<Propriedade>): Promise<Propriedade> {

    if (data.area_total && data.area_agricultavel && data.area_vegetacao) {
      if (!PropriedadeValidator.validarAreas(data.area_total, data.area_agricultavel, data.area_vegetacao)) {
        throw new Error('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.');
      }
    }

    return this.propriedadeRepository.updatePropriedade(id, {
      ...data,
      ...(data.produtor && { produtor: data.produtor }), // Atualiza o produtor, se enviado
      ...(data.culturas && { culturas: data.culturas }), // Atualiza as culturas, se enviado
    });
  }

  async listarTodos(): Promise<Propriedade[]> {
    return this.propriedadeRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Propriedade> {
    const propriedade = await this.propriedadeRepository.findById(id);
    if (!propriedade) {
      throw new Error('Propriedade não encontrada.');
    }
    return propriedade;
  }

  async buscaPropriedadesPorProdutor(produtorId: number): Promise<Propriedade[]> {
    return this.propriedadeRepository.findByProdutor(produtorId);
  }

  async excluirPropriedade(id: number): Promise<void> {
    return this.propriedadeRepository.deletePropriedade(id);
  }
}