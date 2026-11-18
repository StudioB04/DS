import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Bac à sable local : une appli Vite/React autonome pour tester les
// composants du DS en important directement le code source (src/),
// sans avoir à build/publish la librairie à chaque essai.
//
// Ce fichier est totalement séparé de ../vite.config.ts (le build de la
// librairie). `npm run build` ne le charge jamais : rien de ce qui
// est ici n'atteint dist/ ni le package publié.
const src = resolve(__dirname, "../src");

export default defineConfig({
  root: __dirname,
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      $: src,
      $uikit: resolve(src, "components/uikit"),
      $utils: resolve(src, "utils"),
      $hooks: resolve(src, "hooks"),
      "@studio_b04/ds/style/reset": resolve(src, "styles/reset.css"),
      "@studio_b04/ds/style/tailwind-theme": resolve(src, "styles/tailwind-theme.css"),
      "@studio_b04/ds/style/tokens": resolve(src, "styles/themes/tokens.css"),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
});
