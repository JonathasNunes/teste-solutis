import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCulturas1738046707368 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'culturas',
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
                        name: 'safra',
                        type: 'varchar',
                    },
                    {
                        name: 'propriedade_id',
                        type: 'integer',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['propriedade_id'],
                        referencedTableName: 'propriedades',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE', // Quando a propriedade for deletada, as culturas associadas também serão removidas
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('culturas');
    }
}
