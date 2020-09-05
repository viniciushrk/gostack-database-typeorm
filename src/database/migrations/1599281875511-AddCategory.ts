import {MigrationInterface, QueryRunner,Table} from "typeorm";

export class AddCategory1599281875511 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name:'categories',
        columns: [
          {
            name:'id',
            type:'uuid',
            isPrimary:true,
            generationStrategy:'uuid',
            default:'uuid_generate_v4()',
          },
          {
            name:'title',
            type:'varchar',
          },
          {
            name:'created_at',
            type:'timestamp',
            default:'now()',
          },
          {
            name:'updated_at',
            type:'timestamp',
            default:'now()',
          }
        ]
      })
    )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('categories');
    }

}
