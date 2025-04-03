import { defineConfig } from '@solidjs/start/config';
import { browserslistToTargets, Features } from 'lightningcss';
import browserslist from 'browserslist';
import solidSvg from 'vite-plugin-solid-svg';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  vite: {
    // css: {
    //   transformer: 'lightningcss',
    //   lightningcss: {
    //     targets: browserslistToTargets(browserslist('>= .25%')),
    //     include: Features.Nesting | Features.LightDark | Features.Colors,
    //     customAtRules: {
    //       property: {
    //         prelude: '<custom-ident>',
    //         body: 'style-block',
    //       },
    //     },
    //   },
    // },
    // build: {
    //   cssMinify: 'lightningcss',
    // },
    plugins: [
      devtools({
        autoname: true,
      }),
      solidSvg(),
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