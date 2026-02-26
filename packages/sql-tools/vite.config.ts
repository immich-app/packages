import swc from 'unplugin-swc';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/index.ts', 'src/bin/cli.ts'],
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
  plugins: [swc.vite(), tsconfigPaths(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.build.json' })],
});
