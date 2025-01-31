import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Produtor } from './Produtor';
import { Cultura } from './Cultura';

@Entity('propriedades')
export class Propriedade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'varchar' })
    cidade: string;

    @Column({ type: 'varchar' })
    estado: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    area_total: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    area_agricultavel: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    area_vegetacao: number;

    // Relacionamento ManyToOne com a entidade Produtor
    @ManyToOne(() => Produtor, produtor => produtor.propriedades, { onDelete: 'CASCADE' })
    produtor: Produtor;

    // Relacionamento OneToMany com a entidade Cultura
    @OneToMany(() => Cultura, culturas => culturas.propriedade)
    culturas: Cultura[];
}