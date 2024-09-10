import { defineConfig } from '@solidjs/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  ssr: true,
  server: {
    preset: 'bun',
  },
  vite: {
    plugins: [tsconfigPaths({ root: './' })],
  },
});
