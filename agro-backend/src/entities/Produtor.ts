import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Propriedade } from './Propriedade.js';

@Entity('produtores')
@Index('IDX_produtores_cpf_cnpj', ['cpf_cnpj'], { unique: true })
export class Produtor {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID único do produtor',
    type: Number,
  })
  id: number;

  @Column({ type: 'varchar', unique: true })
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor (único)',
    type: String,
  })
  cpf_cnpj: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Nome do produtor',
    type: String,
  })
  nome: string;

  // Relacionamento OneToMany com a entidade Propriedade
  @OneToMany(() => Propriedade, propriedade => propriedade.produtor)
  @ApiProperty({
    description: 'Lista de propriedades associadas ao produtor',
    type: [Propriedade],
  })
  propriedades: Propriedade[];
}