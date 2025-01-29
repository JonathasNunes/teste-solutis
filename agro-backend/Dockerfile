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
