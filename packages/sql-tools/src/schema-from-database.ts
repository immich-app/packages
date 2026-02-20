import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { ReaderContext } from 'src/contexts/reader-context';
import { readers } from 'src/readers';
import { DatabaseLike, DatabaseSchema, PostgresDB, SchemaFromDatabaseOptions } from 'src/types';

const isKysely = (db: DatabaseLike): db is Kysely<unknown> => db instanceof Kysely;

/**
 * Load schema from a database url
 */
export const schemaFromDatabase = async (
  database: DatabaseLike,
  options: SchemaFromDatabaseOptions = {},
): Promise<DatabaseSchema> => {
  const db = isKysely(database)
    ? (database as Kysely<PostgresDB>)
    : new Kysely<PostgresDB>({ dialect: new PostgresJSDialect({ postgres: database }) });
  const ctx = new ReaderContext(options);

  try {
    for (const reader of readers) {
      await reader(ctx, db);
    }

    return ctx.build();
  } finally {
    // only close the connection it we created it
    if (!isKysely(database)) {
      await db.destroy();
    }
  }
};
