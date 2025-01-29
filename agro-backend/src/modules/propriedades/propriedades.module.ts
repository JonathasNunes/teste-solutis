import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PropriedadeController } from 'src/controllers/PropriedadeController';
import { Propriedade } from 'src/entities/Propriedade';
import { PropriedadeService } from 'src/services/PropriedadeService';
import { PropriedadeValidator } from 'src/validators/PropriedadeValidator';

@Module({
    imports: [TypeOrmModule.forFeature([Propriedade])],
    controllers: [PropriedadeController],
    providers: [PropriedadeService, PropriedadeValidator],
})
export class PropriedadesModule {}

