import { asJsonString } from 'src/helpers';
import { SqlTransformer } from 'src/transformers/types';

export const transformOverrides: SqlTransformer = (ctx, item) => {
  const tableName = ctx.overrideTableName;

  const toJson = (value: unknown) => asJsonString(value, { outputTarget: ctx.outputTarget });

  switch (item.type) {
    case 'OverrideCreate': {
      const override = item.override;
      return `INSERT INTO "${tableName}" ("name", "value") VALUES ('${override.name}', ${toJson(override.value)});`;
    }

    case 'OverrideUpdate': {
      const override = item.override;
      return `UPDATE "${tableName}" SET "value" = ${toJson(override.value)} WHERE "name" = '${override.name}';`;
    }

    case 'OverrideDrop': {
      return `DELETE FROM "${tableName}" WHERE "name" = '${item.overrideName}';`;
    }

    default: {
      return false;
    }
  }
};
