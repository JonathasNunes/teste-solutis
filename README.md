
Rodar as Migrations:

npx ts-node -O '{ "module": "CommonJS" }' node_modules/typeorm/cli.js migration:run -d src/data-source.ts

# Agro Backend

Este projeto é um backend desenvolvido com NestJS para gerenciar informações agrícolas. Ele utiliza Docker para facilitar a configuração e execução dos serviços, incluindo um banco de dados PostgreSQL.

## 🛠️ Tecnologias Utilizadas

- **Node.js 18**
- **NestJS**
- **PostgreSQL 14**
- **Docker & Docker Compose**
- **TypeORM** (ORM para PostgreSQL)
- **Jest** (para testes automatizados)

## 📂 Estrutura do Projeto

```
📦 agro-backend
 ┣ 📂 src
 ┃ ┣ 📂 entities     # Definição das entidades do banco
 ┃ ┣ 📂 migrations   # Definição das migrations do banco
 ┃ ┣ 📂 modules      # Módulos do NestJS
 ┃ ┣ 📂 controllers  # Controladores das rotas
 ┃ ┣ 📂 services     # Serviços da aplicação
 ┃ ┣ 📂 __tests__    # Testes automatizados
 ┃ ┣ 📜 main.ts      # Arquivo principal
 ┃ ┣ 📜 app.module.ts # Módulo principal
 ┣ 📜 Dockerfile     # Configuração do container do backend
 ┣ 📜 docker-compose.yml # Configuração dos containers
 ┣ 📜 package.json   # Dependências do projeto
 ┗ 📜 README.md      # Documentação do projeto
```

---

## 🚀 Como Rodar o Projeto

### 🔹 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### 🔹 Configuração e Execução

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/agro-backend.git
   cd agro-backend
   ```

2. Suba os containers com Docker:
   ```sh
   docker-compose up --build
   ```

3. O servidor estará rodando em:
   ```
   http://localhost:3000
   ```

4. Para verificar os logs:
   ```sh
   docker-compose logs -f
   ```

5. Para acessar o container do backend:
   ```sh
   docker exec -it agro-backend_backend_1 bash
   ```

6. Para acessar o banco PostgreSQL:
   ```sh
   docker exec -it postgres_db psql -U postgres -d agro_db
   ```

---

## 🐳 Configuração do Docker

### 🔹 `docker-compose.yml`

```yaml
version: '3.8'
services:
  backend:
    build: ./agro-backend
    ports:
      - "3000:3000"
    volumes:
       - ./agro-backend:/app
       - /app/node_modules
    depends_on:
      - db
    environment:
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
      - DATABASE_USERNAME=postgres
      - DATABASE_PASSWORD=admin
      - DATABASE_NAME=agro_db

  db:
    image: postgres:14
    container_name: postgres_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: agro_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 🔹 `Dockerfile`

```dockerfile
# Imagem base do Node.js
FROM node:18

# Diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Expor a porta usada pelo servidor
EXPOSE 3000

# Comando para iniciar o projeto no modo de desenvolvimento
CMD ["npm", "run", "start:dev"]
```

---

## 🛠️ Configuração do Banco de Dados

A conexão com o banco de dados PostgreSQL é definida por variáveis de ambiente no `docker-compose.yml`. Certifique-se de que os valores correspondem ao que está configurado no seu TypeORM.

Caso precise rodar as migrações do TypeORM manualmente, execute:
```sh
npm run typeorm migration:run
```

---

## ✅ Testes

O projeto utiliza Jest para testes automatizados. Para rodar os testes, use:
```sh
docker exec -it agro-backend_backend_1 npm run test
```

Caso queira rodar os testes localmente, sem Docker:
```sh
npm run test
```

---

## 🛠️ Troubleshooting

### ❌ Erro: `Cannot find module /app/dist/app.module`

Se o NestJS não encontrar o módulo principal, tente:
```sh
docker-compose down
rm -rf agro-backend/dist
npm run build
docker-compose up --build
```

### ❌ Porta 3000 já está em uso

Verifique os processos rodando na porta 3000:
```sh
lsof -i :3000
```
Matar o processo:
```sh
kill -9 <PID>
```
Ou altere a porta no `main.ts`:
```ts
await app.listen(4000);
```

---

**👨‍💻 Desenvolvido por [Jonathas Nunes](https://github.com/JonathasNunes)** 🚀

