import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Produtor } from './Produtor.js';
import { Cultura } from './Cultura.js';

@Entity('propriedades')
export class Propriedade {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID único da propriedade',
        type: Number,
    })
    id: number;

    @Column({ type: 'varchar' })
    @ApiProperty({
        description: 'Nome da propriedade',
        type: String,
    })
    nome: string;

    @Column({ type: 'varchar' })
    @ApiProperty({
        description: 'Cidade onde a propriedade está localizada',
        type: String,
    })
    cidade: string;

    @Column({ type: 'varchar' })
    @ApiProperty({
        description: 'Estado onde a propriedade está localizada',
        type: String,
    })
    estado: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({
        description: 'Área total da propriedade',
        type: Number,
    })
    area_total: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({
        description: 'Área agricultável da propriedade',
        type: Number,
    })
    area_agricultavel: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({
        description: 'Área de vegetação da propriedade',
        type: Number,
    })
    area_vegetacao: number;

    // Relacionamento ManyToOne com a entidade Produtor
    @ManyToOne(() => Produtor, produtor => produtor.propriedades, { onDelete: 'CASCADE' })
    @ApiProperty({
        description: 'Produtor associado a essa propriedade',
        type: Produtor,
    })
    produtor: Produtor;

    // Relacionamento OneToMany com a entidade Cultura
    @OneToMany(() => Cultura, culturas => culturas.propriedade)
    @ApiProperty({
        description: 'Lista de culturas associadas à propriedade',
        type: [Cultura],
    })
    culturas: Cultura[];
}