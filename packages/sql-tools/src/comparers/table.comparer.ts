import { compareColumns } from 'src/comparers/column.comparer';
import { compareConstraints } from 'src/comparers/constraint.comparer';
import { compareIndexes } from 'src/comparers/index.comparer';
import { compareTriggers } from 'src/comparers/trigger.comparer';
import { compare } from 'src/helpers';
import { Comparer, DatabaseTable, Reason, SchemaDiffOptions } from 'src/types';

export const compareTables = (options: SchemaDiffOptions): Comparer<DatabaseTable> => ({
  onMissing: (source) => [
    {
      type: 'TableCreate',
      table: source,
      reason: Reason.MissingInTarget,
    },
  ],
  onExtra: (target) => [
    {
      type: 'TableDrop',
      tableName: target.name,
      reason: Reason.MissingInSource,
    },
  ],
  onCompare: (source, target) => {
    return [
      ...compare(source.columns, target.columns, options.columns, compareColumns()),
      ...compare(source.indexes, target.indexes, options.indexes, compareIndexes()),
      ...compare(source.constraints, target.constraints, options.constraints, compareConstraints()),
      ...compare(source.triggers, target.triggers, options.triggers, compareTriggers()),
    ];
  },
});
