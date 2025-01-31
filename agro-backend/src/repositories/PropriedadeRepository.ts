import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Propriedade } from '../entities/Propriedade';
import { IPropriedadeRepository } from 'src/interfaces/IPropriedadeRepository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PropriedadeRepository 
  extends Repository<Propriedade> 
  implements IPropriedadeRepository 
{
  private readonly logger = new Logger(PropriedadeRepository.name);

  constructor(private dataSource: DataSource) {
    super(Propriedade, dataSource.createEntityManager());
  }

  async findByProdutor(produtorId: number): Promise<Propriedade[]> {
    this.logger.log(`Buscando propriedades do produtor com ID: ${produtorId}`);
    const propriedades = await this.find({
      where: { produtor: { id: produtorId } },
      relations: ['produtor', 'culturas'],
    });
    this.logger.log(`Total de propriedades encontradas: ${propriedades.length}`);
    return propriedades;
  }

  async createPropriedade(propriedadeData: Partial<Propriedade>): Promise<Propriedade> {
    this.logger.log('Criando nova propriedade');
    const propriedade = this.create(propriedadeData);
    const savedPropriedade = await this.save(propriedade);
    this.logger.log(`Propriedade criada com ID: ${savedPropriedade.id}`);
    return savedPropriedade;
  }

  async updatePropriedade(id: number, updateData: Partial<Propriedade>): Promise<Propriedade> {
    this.logger.log(`Atualizando propriedade com ID: ${id}`);
    const propriedade = await this.findOne({ where: { id } });

    if (!propriedade) {
      this.logger.warn(`Propriedade com ID ${id} não encontrada`);
      throw new Error('Propriedade não encontrada.');
    }

    Object.assign(propriedade, updateData);
    const updatedPropriedade = await this.save(propriedade);
    this.logger.log(`Propriedade atualizada com sucesso. ID: ${updatedPropriedade.id}`);
    return updatedPropriedade;
  }

  async findAll(): Promise<Propriedade[]> {
    this.logger.log('Buscando todas as propriedades');
    const propriedades = await this.find({ relations: ['produtor', 'culturas'] });
    this.logger.log(`Total de propriedades encontradas: ${propriedades.length}`);
    return propriedades;
  }

  async findById(id: number): Promise<Propriedade | undefined> {
    this.logger.log(`Buscando propriedade pelo ID: ${id}`);
    const propriedade = await this.findOne({ where: { id }, relations: ['produtor', 'culturas'] });
    this.logger.log(`Propriedade encontrada: ${propriedade ? 'Sim' : 'Não'}`);
    return propriedade;
  }

  async deletePropriedade(id: number): Promise<void> {
    this.logger.log(`Removendo propriedade com ID: ${id}`);
    const propriedade = await this.findOne({ where: { id } });

    if (!propriedade) {
      this.logger.warn(`Propriedade com ID ${id} não encontrada`);
      throw new Error('Propriedade não encontrada.');
    }

    await this.remove(propriedade);
    this.logger.log(`Propriedade com ID ${id} removida com sucesso`);
  }

  // Recuperar total de fazendas
  async countTotalFazendas(): Promise<number> {
    this.logger.log('Iniciando contagem do total de fazendas');
    const total = await this.count();
    this.logger.log(`Total de fazendas encontrado: ${total}`);
    return total;
  }

  // Recuperar o total de hectares
  async getTotalHectares(): Promise<number> {
    this.logger.log('Calculando o total de hectares');
    const result = await this.createQueryBuilder('propriedade')
      .select('SUM(propriedade.area_total)', 'totalHectares')
      .getRawOne();

    const totalHectares = result?.totalHectares ? Number(result.totalHectares) : 0;
    this.logger.log(`Total de hectares encontrado: ${totalHectares}`);
    return totalHectares;
  }
}