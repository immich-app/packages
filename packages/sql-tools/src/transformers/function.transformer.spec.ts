import { BaseContext } from 'src/contexts/base-context';
import { transformFunctions } from 'src/transformers/function.transformer';
import { describe, expect, it } from 'vitest';

const ctx = new BaseContext({});

describe(transformFunctions.name, () => {
  describe('FunctionDrop', () => {
    it('should work', () => {
      expect(
        transformFunctions(ctx, {
          type: 'FunctionDrop',
          functionName: 'test_func',
          reason: 'unknown',
        }),
      ).toEqual(`DROP FUNCTION test_func;`);
    });
  });
});
