import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // p2pt/bittorrent-tracker import node's "events"; Vite externalizes
      // node builtins for the browser, so point it at the npm polyfill.
      events: "events/events.js"
    }
  },
  server: {
    port: 8080
  }
});
