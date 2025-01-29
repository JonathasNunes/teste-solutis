import { DataSource } from 'typeorm';
import { CreateProdutores1738046415429 } from './migrations/1738046415429-CreateProdutores';
import { CreatePropriedades1738046558282 } from './migrations/1738046558282-CreatePropriedades';
import { CreateCulturas1738046707368 } from './migrations/1738046707368-CreateCulturas';
import { Produtor } from './entities/Produtor';
import { Propriedade } from './entities/Propriedade';
import { Cultura } from './entities/Cultura';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'admin',
  database: process.env.DATABASE_NAME || 'agro_db',
  entities: [
    Produtor, 
    Propriedade,
    Cultura
  ],
  migrations: [
    CreateProdutores1738046415429,
    CreatePropriedades1738046558282,
    CreateCulturas1738046707368
  ],
  synchronize: false, // Sempre manter como false em produção
  logging: true,
});
