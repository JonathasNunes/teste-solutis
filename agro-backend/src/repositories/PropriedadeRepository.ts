import { EntityRepository, Repository } from 'typeorm';
import { Propriedade } from '../entities/Propriedade';
import { IPropriedadeRepository } from 'src/interfaces/IPropriedadeRepository';

@EntityRepository(Propriedade)
export class PropriedadeRepository 
  extends Repository<Propriedade> 
  implements IPropriedadeRepository 
{
  async findByProdutor(produtorId: number): Promise<Propriedade[]> {
    return this.find({
      where: { produtor: { id: produtorId } },
      relations: ['produtor', 'culturas'],
    });
  }

  async createPropriedade(propriedadeData: Partial<Propriedade>): Promise<Propriedade> {
    const propriedade = this.create(propriedadeData);
    return this.save(propriedade);
  }

  async updatePropriedade(
    id: number,
    updateData: Partial<Propriedade>
  ): Promise<Propriedade> {
    const propriedade = await this.findOne({ where: { id } });
    if (!propriedade) {
      throw new Error('Propriedade não encontrada.');
    }

    Object.assign(propriedade, updateData);
    return this.save(propriedade);
  }

  async findAll(): Promise<Propriedade[]> {
    return this.find({ relations: ['produtor', 'culturas'] }); // Inclui as relações para retorno completo
  }

  async findById(id: number): Promise<Propriedade | undefined> {
    return this.findOne({ where: { id }, relations: ['produtor', 'culturas'] });
  }

  async deletePropriedade(id: number): Promise<void> {
    const propriedade = await this.findOne({ where: { id } });
    if (!propriedade) {
      throw new Error('Propriedade não encontrada.');
    }

    await this.remove(propriedade);
  }
}
