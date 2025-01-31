import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProdutorController } from '../../controllers/ProdutorController';
import { Produtor } from '../../entities/Produtor';
import { ProdutorService } from '../../services/ProdutorService';
import { ProdutorValidator } from '../../validators/ProdutorValidator';
import { ProdutorRepository } from 'src/repositories/ProdutorRepository';
import { PropriedadesModule } from '../propriedades/propriedades.module';
import { CulturasModule } from '../culturas/culturas.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produtor]), 
    forwardRef(() => PropriedadesModule),
    forwardRef(() => CulturasModule), 
  ],
  controllers: [ProdutorController],
  providers: [ProdutorService, ProdutorValidator, 
    {
      provide: ProdutorRepository,
      useFactory: (dataSource: DataSource) => new ProdutorRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [ProdutorService, ProdutorRepository]
})
export class ProdutoresModule {}
