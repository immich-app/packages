import { ProcessorContext } from './contexts/processor-context';
import { DatabaseColumn } from './types';

export const columnVersionMapper = (ctx: ProcessorContext, column: DatabaseColumn) => {
  switch (ctx.databaseVersion) {
    case 'postgres-18': {
      return {
        ...column,
        default: column.default === 'uuid_generate_v4()' ? 'uuidv4()' : column.default,
      };
    }
    default: {
      return column;
    }
  }
};
