import { EntityRepository, Repository } from 'typeorm';
import { Cultura } from '../entities/Cultura';
import { Propriedade } from '../entities/Propriedade';
import { ICulturaRepository } from '../interfaces/ICulturaRepository';

@EntityRepository(Cultura)
export class CulturaRepository 
extends Repository<Cultura> 
implements ICulturaRepository
{
  // Encontrar todas as culturas de uma propriedade
  async findByPropriedade(propriedadeId: number): Promise<Cultura[]> {
    return this.find({ where: { propriedade: { id: propriedadeId } } });
  }

  // Criar uma nova cultura
  async createCultura(propriedade: Propriedade, nome: string, safra: string) {
    const cultura = this.create({
      propriedade,
      nome,
      safra,
    });

    return await this.save(cultura);
  }
}
