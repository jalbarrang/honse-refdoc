import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@solidjs/start/config";
import manifest from "./src/generated/manifest.json";

export default defineConfig({
  server: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: ["/", ...manifest.routes],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
