import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CulturaController } from 'src/controllers/CulturaController';
import { Cultura } from 'src/entities/Cultura';
import { CulturaService } from 'src/services/CulturaService';
import { CulturaValidator } from 'src/validators/CulturaValidator';

@Module({
    imports: [TypeOrmModule.forFeature([Cultura])],
    controllers: [CulturaController],
    providers: [CulturaService, CulturaValidator],
})
export class CulturasModule {}
