import { EntityRepository, Repository } from 'typeorm';
import { Produtor } from '../entities/Produtor.js';
import { IProdutorRepository } from '../interfaces/IProdutorRepository.js';
import { Logger } from '@nestjs/common';

@EntityRepository(Produtor)
export class ProdutorRepository
  extends Repository<Produtor>
  implements IProdutorRepository
{
  private readonly logger = new Logger(ProdutorRepository.name);

  async findByCpfCnpj(cpfCnpj: string): Promise<Produtor | undefined> {
    this.logger.log(`Buscando produtor pelo CPF/CNPJ: ${cpfCnpj}`);
    const produtor = await this.findOne({ where: { cpf_cnpj: cpfCnpj } });
    this.logger.log(`Produtor encontrado: ${produtor ? 'Sim' : 'Não'}`);
    return produtor;
  }

  async createProdutor(produtor: Partial<Produtor>): Promise<Produtor> {
    this.logger.log('Criando novo produtor');
    const newProdutor = this.create(produtor);
    const savedProdutor = await this.save(newProdutor);
    this.logger.log(`Produtor criado com ID: ${savedProdutor.id}`);
    return savedProdutor;
  }

  async updateProdutor(id: number, updateData: Partial<Produtor>): Promise<Produtor> {
    this.logger.log(`Atualizando produtor com ID: ${id}`);
    const produtor = await this.findOne({ where: { id } });

    if (!produtor) {
      this.logger.warn(`Produtor com ID ${id} não encontrado`);
      throw new Error('Produtor não encontrado.');
    }

    Object.assign(produtor, updateData);
    const updatedProdutor = await this.save(produtor);
    this.logger.log(`Produtor atualizado com sucesso. ID: ${updatedProdutor.id}`);
    return updatedProdutor;
  }

  async findAll(): Promise<Produtor[]> {
    this.logger.log('Buscando todos os produtores');
    const produtores = await this.find();
    this.logger.log(`Total de produtores encontrados: ${produtores.length}`);
    return produtores;
  }

  async findById(id: number): Promise<Produtor | undefined> {
    this.logger.log(`Buscando produtor pelo ID: ${id}`);
    const produtor = await this.findOne({ where: { id } });
    this.logger.log(`Produtor encontrado: ${produtor ? 'Sim' : 'Não'}`);
    return produtor;
  }

  async deleteProdutor(id: number): Promise<void> {
    this.logger.log(`Removendo produtor com ID: ${id}`);
    const produtor = await this.findOne({ where: { id } });

    if (!produtor) {
      this.logger.warn(`Produtor com ID ${id} não encontrado`);
      throw new Error('Produtor não encontrado.');
    }

    await this.remove(produtor);
    this.logger.log(`Produtor com ID ${id} removido com sucesso`);
  }  
}