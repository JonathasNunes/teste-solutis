import { MigrationInterface, QueryRunner, Table  } from "typeorm";

export class CreateProdutores1738046415429 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'produtores',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                    },
                    {
                        name: 'cpf_cnpj',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('produtores');
    }
}