import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CulturaController } from '../../controllers/CulturaController';
import { Cultura } from '../../entities/Cultura';
import { CulturaService } from '../../services/CulturaService';
import { CulturaValidator } from '../../validators/CulturaValidator';
import { CulturaRepository } from 'src/repositories/CulturaRepository';
import { ProdutoresModule } from '../produtores/produtores.module';
import { PropriedadesModule } from '../propriedades/propriedades.module';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cultura]), 
        forwardRef(() => ProdutoresModule),
        forwardRef(() => PropriedadesModule),
    ],
    controllers: [CulturaController],
    providers: [
        CulturaService, 
        CulturaValidator, 
        {
            provide: CulturaRepository,
            useFactory: (dataSource: DataSource) => new CulturaRepository(dataSource),
            inject: [DataSource],
        },
    ],
    exports: [CulturaService, CulturaRepository]
})
export class CulturasModule {}