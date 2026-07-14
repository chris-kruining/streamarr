import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    plugins: [
      // devtools({
      //   autoname: true,
      // }),
      // solidSvg(),
    ],
  },
  solid: {
    babel: {
      compact: true,
    },
    solid: {
      validate: false,
    },
  },
  server: {
    preset: "bun",
    prerender: {
      routes: ["/", "/sitemap.xml"],
    },
  },
});
