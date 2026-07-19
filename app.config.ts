import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@solidjs/start/config";
import manifest from "./src/generated/manifest.json";

const basePath = process.env.BASE_PATH?.trim().replace(/^\/+|\/+$/g, "") ?? "";
const baseURL = basePath ? `/${basePath}/` : "/";

export default defineConfig({
  server: {
    baseURL,
    preset: "static",
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: ["/", "/404.html", ...manifest.routes],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
