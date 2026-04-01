import { Column, DatabaseSchema, Table } from 'src';

@Table()
export class Table1 {
  @Column({ type: 'character varying', array: true, default: ['a', 'b'] })
  column1!: string[];
}

export const description = 'should register a table with a column with a default value (array)';
export const schema: DatabaseSchema = {
  databaseName: 'postgres',
  schemaName: 'public',
  functions: [],
  enums: [],
  extensions: [],
  parameters: [],
  overrides: [],
  tables: [
    {
      name: 'table1',
      columns: [
        {
          name: 'column1',
          tableName: 'table1',
          type: 'character varying',
          nullable: false,
          isArray: true,
          primary: false,
          synchronize: true,
          default: `'{"a", "b"}'`,
        },
      ],
      indexes: [],
      triggers: [],
      constraints: [],
      synchronize: true,
    },
  ],
  warnings: [],
};
