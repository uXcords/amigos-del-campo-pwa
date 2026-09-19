import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/amigos-del-campo-pwa/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Amigos del Campo",
        short_name: "Amigos del Campo",
        description:
          "Frutas y verduras frescas directamente del campo.",

        theme_color: "#205d2d",
        background_color: "#f8f7ef",
        display: "standalone",

        start_url: "/amigos-del-campo-pwa/",
        scope: "/amigos-del-campo-pwa/",

        icons: [
          {
            src: "/amigos-del-campo-pwa/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/amigos-del-campo-pwa/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});