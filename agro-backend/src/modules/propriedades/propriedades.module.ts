import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PropriedadeController } from '../../controllers/PropriedadeController';
import { Propriedade } from '../../entities/Propriedade';
import { PropriedadeService } from '../../services/PropriedadeService';
import { PropriedadeValidator } from '../../validators/PropriedadeValidator';
import { PropriedadeRepository } from 'src/repositories/PropriedadeRepository';
import { ProdutoresModule } from '../produtores/produtores.module';
import { CulturasModule } from '../culturas/culturas.module';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Propriedade]), 
        forwardRef(() => ProdutoresModule),
        forwardRef(() => CulturasModule), 
    ],
    controllers: [PropriedadeController],
    providers: [
        PropriedadeService,
        PropriedadeValidator, 
        {
            provide: PropriedadeRepository,
            useFactory: (dataSource: DataSource) => new PropriedadeRepository(dataSource),
            inject: [DataSource],
        },
    ],
    exports: [PropriedadeService, PropriedadeRepository]
})
export class PropriedadesModule {}

