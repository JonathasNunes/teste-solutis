import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Propriedade } from './Propriedade';

@Entity('culturas')
export class Cultura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'varchar' })
    safra: string;

    // Relacionamento ManyToOne com a entidade Propriedade
    @ManyToOne(() => Propriedade, propriedade => propriedade.culturas, { onDelete: 'CASCADE' })
    propriedade: Propriedade;
}