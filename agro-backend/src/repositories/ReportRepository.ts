import { EntityRepository, Repository } from 'typeorm';
import { Propriedade } from '../entities/Propriedade';
import { Logger } from '@nestjs/common';

@EntityRepository(Propriedade)
export class ReportRepository extends Repository<Propriedade> {
  private readonly logger = new Logger(ReportRepository.name);

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
      .select('SUM(propriedade.areaTotal)', 'totalHectares')
      .getRawOne();

    const totalHectares = result?.totalHectares ? Number(result.totalHectares) : 0;
    this.logger.log(`Total de hectares encontrado: ${totalHectares}`);
    return totalHectares;
  }
}