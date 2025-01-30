import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PropriedadeController } from '../../controllers/PropriedadeController.js';
import { Propriedade } from '../../entities/Propriedade.js';
import { PropriedadeService } from '../../services/PropriedadeService.js';
import { PropriedadeValidator } from '../../validators/PropriedadeValidator.js';

@Module({
    imports: [TypeOrmModule.forFeature([Propriedade])],
    controllers: [PropriedadeController],
    providers: [PropriedadeService, PropriedadeValidator],
})
export class PropriedadesModule {}

