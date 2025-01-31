import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Cultura } from '../entities/Cultura';
import { Propriedade } from '../entities/Propriedade';
import { ICulturaRepository } from '../interfaces/ICulturaRepository';

@Injectable()
export class CulturaRepository
  extends Repository<Cultura>
  implements ICulturaRepository
{
  private readonly logger = new Logger(CulturaRepository.name);

  constructor(private dataSource: DataSource) {
    super(Cultura, dataSource.createEntityManager());
  }

  // Encontrar todas as culturas de uma propriedade
  async findByPropriedade(propriedadeId: number): Promise<Cultura[]> {
    this.logger.log(`Buscando culturas para a propriedade com ID ${propriedadeId}`);
    const culturas = await this.find({ where: { propriedade: { id: propriedadeId } } });
    this.logger.log(`Encontradas ${culturas.length} culturas para a propriedade com ID ${propriedadeId}`);
    return culturas;
  }

  // Criar uma nova cultura
  async createCultura(propriedade: Propriedade, nome: string, safra: string) {
    this.logger.log(`Criando cultura com nome ${nome}, safra ${safra} para a propriedade com ID ${propriedade.id}`);
    
    const cultura = this.create({
      propriedade,
      nome,
      safra,
    });

    const culturaCriada = await this.save(cultura);
    this.logger.log(`Cultura criada com sucesso, ID ${culturaCriada.id}`);
    return culturaCriada;
  }
}