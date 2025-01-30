import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Agro') // Título da API
    .setDescription('API para gerenciar informações sobre dados do Agro')
    .setVersion('1.0') // Versão da API
    .addTag('produtor') // Tags para organização
    .addTag('propriedade')
    .addTag('cultura')
    .addTag('report')
    .build();

  // Cria o documento Swagger com base nas configurações
  const document = SwaggerModule.createDocument(app, config);

  // Serve a documentação do Swagger na rota "/api-docs"
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
