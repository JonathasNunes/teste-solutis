import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Propriedade } from './Propriedade.js';

@Entity('culturas')
export class Cultura {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID único da cultura',
        type: Number,
    })
    id: number;

    @Column({ type: 'varchar' })
    @ApiProperty({
        description: 'Nome da cultura',
        type: String,
    })
    nome: string;

    @Column({ type: 'varchar' })
    @ApiProperty({
        description: 'Safra associada à cultura',
        type: String,
    })
    safra: string;

    // Relacionamento ManyToOne com a entidade Propriedade
    @ManyToOne(() => Propriedade, propriedade => propriedade.culturas, { onDelete: 'CASCADE' })
    @ApiProperty({
        description: 'Propriedade associada a essa cultura',
        type: (await import('./Propriedade.js')).Propriedade,
    })
    propriedade: Propriedade;
}