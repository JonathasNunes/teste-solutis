import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CulturaController } from '../../controllers/CulturaController.js';
import { Cultura } from '../../entities/Cultura.js';
import { CulturaService } from '../../services/CulturaService.js';
import { CulturaValidator } from '../../validators/CulturaValidator.js';

@Module({
    imports: [TypeOrmModule.forFeature([Cultura])],
    controllers: [CulturaController],
    providers: [CulturaService, CulturaValidator],
})
export class CulturasModule {}
