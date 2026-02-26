import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import swc from 'unplugin-swc';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/bin/cli.ts')],
      name: '@immich/sql-tools',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
      },
    },
    ssr: true,
  },
  ssr: {
    noExternal: /^src.*$/,
  },
  test: {
    server: {
      deps: {
        fallbackCJS: true,
      },
    },
    env: {
      TZ: 'UTC',
    },
  },
  plugins: [swc.vite(), tsconfigPaths(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
});
