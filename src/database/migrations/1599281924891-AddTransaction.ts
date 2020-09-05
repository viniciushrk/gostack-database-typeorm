import {MigrationInterface, QueryRunner,Table, TableForeignKey} from "typeorm";

export class AddTransaction1599281924891 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name: "transactions",
          columns:[
            {
              name:'id',
              type:'uuid',
              isPrimary:true,
              generationStrategy:'uuid',
              default:'uuid_generate_v4()'
            },
            {
              name:'title',
              type:'varchar',
            },
            {
              name:'type',
              type:'varchar',
            },
            {
              name:'value',
              type:'decimal',
              precision:10,
              scale:2,
            },
            {
              name:'category_id',
              type: 'uuid',
              isNullable: true,
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
      );

      await queryRunner.createForeignKey('transactions',new TableForeignKey({
            name:'transactions',
            columnNames:['category_id'],
            referencedColumnNames:['id'],
            referencedTableName:'categories',
            onDelete:'SET NULL',
            onUpdate:'CASCADE',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('transactions');
    }
}
