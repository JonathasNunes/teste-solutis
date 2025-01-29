import { EntityRepository, Repository } from 'typeorm';
import { Produtor } from '../entities/Produtor';
import { IProdutorRepository } from '../interfaces/IProdutorRepository';

@EntityRepository(Produtor)
export class ProdutorRepository
  extends Repository<Produtor>
  implements IProdutorRepository
{
  async findByCpfCnpj(cpfCnpj: string): Promise<Produtor | undefined> {
    return this.findOne({ where: { cpf_cnpj: cpfCnpj } });
  }

  async createProdutor(produtor: Partial<Produtor>): Promise<Produtor> {
    const newProdutor = this.create(produtor);
    return this.save(newProdutor);
  }

  async updateProdutor(
    id: number,
    updateData: Partial<Produtor>
  ): Promise<Produtor> {
    const produtor = await this.findOne({ where: { id } });
    if (!produtor) {
      throw new Error('Produtor não encontrado.');
    }

    Object.assign(produtor, updateData);
    return this.save(produtor);
  }

  async findAll(): Promise<Produtor[]> {
    return this.find();
  }

  async findById(id: number): Promise<Produtor | undefined> {
    return this.findOne({ where: { id } });
  }

  async deleteProdutor(id: number): Promise<void> {
    const produtor = await this.findOne({ where: { id } });
    if (!produtor) {
      throw new Error('Produtor não encontrado.');
    }

    await this.remove(produtor);
  }  
}
