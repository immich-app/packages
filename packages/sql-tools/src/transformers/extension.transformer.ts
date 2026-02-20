import { SqlTransformer } from 'src/transformers/types';
import { DatabaseExtension } from 'src/types';

export const transformExtensions: SqlTransformer = (ctx, item) => {
  switch (item.type) {
    case 'ExtensionCreate': {
      return asExtensionCreate(item.extension);
    }

    case 'ExtensionDrop': {
      return asExtensionDrop(item.extensionName);
    }

    default: {
      return false;
    }
  }
};

const asExtensionCreate = (extension: DatabaseExtension): string => {
  return `CREATE EXTENSION IF NOT EXISTS "${extension.name}";`;
};

const asExtensionDrop = (extensionName: string): string => {
  return `DROP EXTENSION "${extensionName}";`;
};
