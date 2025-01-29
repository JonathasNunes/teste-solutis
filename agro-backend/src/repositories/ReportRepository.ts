import { EntityRepository, Repository } from 'typeorm';
import { Propriedade } from '../entities/Propriedade';

@EntityRepository(Propriedade)
export class ReportRepository extends Repository<Propriedade> {
  // Recuperar total de fazendas
  async countTotalFazendas() {
    return this.count();
  }

  // Recuperar o total de hectares
  async getTotalHectares() {
    const result = await this.createQueryBuilder('propriedade')
      .select('SUM(propriedade.areaTotal)', 'totalHectares')
      .getRawOne();
    
    return result.total ? Number(result.total) : 0;
  }
}
