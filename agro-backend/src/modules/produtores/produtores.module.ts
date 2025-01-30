import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProdutorController } from '../../controllers/ProdutorController.js';
import { Produtor } from '../../entities/Produtor.js';
import { ProdutorService } from '../../services/ProdutorService.js';
import { ProdutorValidator } from '../../validators/ProdutorValidator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Produtor])],
  controllers: [ProdutorController],
  providers: [ProdutorService, ProdutorValidator],
})
export class ProdutoresModule {}
