import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePropriedades1738046558282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'propriedades',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                    },
                    {
                        name: 'cidade',
                        type: 'varchar',
                    },
                    {
                        name: 'estado',
                        type: 'varchar',
                    },
                    {
                        name: 'area_total',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'area_agricultavel',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'area_vegetacao',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'produtor_id',
                        type: 'integer',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['produtor_id'],
                        referencedTableName: 'produtores',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE', // Quando o produtor for deletado, as propriedades associadas também serão removidas
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('propriedades');
    }
}