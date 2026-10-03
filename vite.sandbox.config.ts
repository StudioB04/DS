import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Bac à sable local : une appli Vite/React autonome pour tester les
// composants du DS en important directement le code source (src/),
// sans avoir à build/publish la librairie à chaque essai.
//
// Ce fichier est totalement séparé de vite.config.ts (le build de la
// librairie). `npm run build` ne le charge jamais : rien de ce qui
// est ici n'atteint dist/ ni le package publié.
export default defineConfig({
  root: resolve(__dirname, "sandbox"),
  resolve: {
    alias: {
      $: resolve(__dirname, "src"),
      $uikit: resolve(__dirname, "src/components/uikit"),
      $utils: resolve(__dirname, "src/utils"),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
});
