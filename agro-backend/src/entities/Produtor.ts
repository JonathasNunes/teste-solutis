import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Propriedade } from './Propriedade';

@Entity('produtores')
@Index('IDX_produtores_cpf_cnpj', ['cpf_cnpj'], { unique: true })
export class Produtor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  cpf_cnpj: string;

  @Column({ type: 'varchar' })
  nome: string;

  // Relacionamento OneToMany com a entidade Propriedade
  @OneToMany(() => Propriedade, propriedade => propriedade.produtor)
  propriedades: Propriedade[];
}