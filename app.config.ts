import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import devtools from "solid-devtools/vite";

export default defineConfig({
  vite: {
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
    preset: "bun",
    prerender: {
      routes: ["/sitemaps.xml"],
    },
  },
});
