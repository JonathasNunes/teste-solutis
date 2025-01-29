# teste-solutis
Código para teste do processo seletivo da Solutis Tecnologia


Rodar as Migrations:

npx ts-node -O '{ "module": "CommonJS" }' node_modules/typeorm/cli.js migration:run -d src/data-source.ts