import { Kysely, sql } from 'kysely';
import { schemaDiff } from 'src/schema-diff';
import { schemaFromCode } from 'src/schema-from-code';
import { schemaFromDatabase } from 'src/schema-from-database';
import { DatabaseConnectionParams, SchemaDiffResult, SchemaFromCodeOptions } from 'src/types';
import { getKyselyDB, importFixture, loadFixtures } from 'test/utils';
import { afterEach, beforeEach, describe, expect, it, onTestFailed } from 'vitest';

const DEBUG_FILENAME = '';

const currentBugs = new Set([
  'foreign-key-constraint-column-order.stub.ts',
  'foreign-key-constraint-multiple-columns.stub.ts',
  'foreign-key-constraint-no-index.stub.ts,',
  'foreign-key-constraint-no-primary.stub.ts',
  'foreign-key-constraint.stub.ts',
  'foreign-key-inferred-type.stub.ts',
  'foreign-key-with-unique-constraint.stub.ts',
  'foreign-key-constraint-no-index.stub.ts',
]);

const fixtures = loadFixtures('test/fixtures').filter(([name]) => {
  if (currentBugs.has(name)) {
    return false;
  }

  if (DEBUG_FILENAME && DEBUG_FILENAME === name) {
    return false;
  }

  return true;
});

class TestDatabase {
  private constructor(
    public kysely: Kysely<unknown>,
    public connection: DatabaseConnectionParams,
  ) {}

  static async create() {
    const { kysely, connection } = await getKyselyDB();
    return new TestDatabase(kysely, connection);
  }

  async destroy() {
    await this.kysely.destroy();
  }

  async diff(options: SchemaFromCodeOptions) {
    const source = schemaFromCode({
      ...options,
      outputTarget: 'sql',
      overrides: true,
      uuidFunction: 'uuid_generate_v4()',
    });
    expect(source.warnings).toEqual([]);

    const target = await this.#schemaFromDatabase();

    const up = schemaDiff(source, target, {
      tables: { ignoreExtra: true },
      functions: { ignoreExtra: false },
      parameters: { ignoreExtra: true },
    });

    const down = schemaDiff(target, source, {
      tables: { ignoreExtra: false, ignoreMissing: true },
      functions: { ignoreExtra: false },
      extensions: { ignoreMissing: true },
      parameters: { ignoreMissing: true },
    });

    return { up, down };
  }

  async query({ asSql }: SchemaDiffResult) {
    const query = asSql({ outputTarget: 'sql' }).join('\n');
    const results = await sql.raw(query).execute(this.kysely);
    expect(results).toBeDefined();
  }

  #schemaFromDatabase() {
    return schemaFromDatabase({ connection: this.connection });
  }
}

describe('postgres', () => {
  describe('test files', () => {
    let db: TestDatabase;

    beforeEach(async () => {
      schemaFromCode({ reset: true });
      db = await TestDatabase.create();
    });

    afterEach(async () => {
      await db.destroy();
    });

    it('should work', () => {
      expect(1).toEqual(1);
    });

    it.each(fixtures)('%s', async (name, filename) => {
      const { options } = await importFixture(filename);
      const diff1 = await db.diff(options);

      onTestFailed(() => {
        console.log(
          `DEBUG: ${filename}
up sql
=========================================
${diff1.up.asSql({ outputTarget: 'sql' }).join('\n')}
=========================================

down sql
=========================================
${diff1.down.asSql({ outputTarget: 'sql' }).join('\n')}
=========================================
`
            .split('\n')
            .join('\n> '),
        );
      });

      // apply the migration
      await db.query(diff1.up);

      // verify changes
      const diff2 = await db.diff(options);
      expect(diff2.up.items).toEqual([]);
      expect(diff2.down.items).toEqual([]);

      // apply the down migration
      await db.query(diff1.down);

      // verify changes
      const diff3 = await db.diff(options);
      expect(diff3.up.items).toEqual(diff1.up.items);
      expect(diff3.down.items).toEqual(diff1.down.items);
    });
  });
});
