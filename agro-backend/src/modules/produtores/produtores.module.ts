import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProdutorController } from 'src/controllers/ProdutorController';
import { Produtor } from 'src/entities/Produtor';
import { ProdutorService } from 'src/services/ProdutorService';
import { ProdutorValidator } from 'src/validators/ProdutorValidator';

@Module({
  imports: [TypeOrmModule.forFeature([Produtor])],
  controllers: [ProdutorController],
  providers: [ProdutorService, ProdutorValidator],
})
export class ProdutoresModule {}
