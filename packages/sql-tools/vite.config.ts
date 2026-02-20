import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: { alias: { src: 'src' } },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SQL Tools',
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
    // bundle everything except for Node built-ins
    noExternal: /^(?!node:).*$/,
  },
  plugins: [tsconfigPaths(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
});
