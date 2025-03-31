import { defineConfig } from '@solidjs/start/config';
import solidSvg from 'vite-plugin-solid-svg';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  build: {
    sourceMap: true,
  },
  vite: {
    plugins: [
      devtools({
        autoname: true,
      }),
      solidSvg(),
      {
        name: 'temp',
        configResolved(config) {
          console.log(config.resolve.alias);
        },
      },
    ],
  },
  solid: {
    babel: {
      compact: true,
    },
  },
  server: {
    preset: 'bun',
    prerender: {
      routes: ['/sitemaps.xml'],
    },
  },
});
