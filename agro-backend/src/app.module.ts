import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoresModule } from './modules/produtores/produtores.module';
import { PropriedadesModule } from './modules/propriedades/propriedades.module';
import { CulturasModule } from './modules/culturas/culturas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin',
      database: process.env.DATABASE_NAME || 'agro_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProdutoresModule,
    PropriedadesModule,
    CulturasModule,
  ],
})
export class AppModule {}
