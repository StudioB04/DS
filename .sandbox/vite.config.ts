import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Bac à sable local : une appli Vite/React autonome pour tester les
// composants du DS en important directement le code source (src/),
// sans avoir à build/publish la librairie à chaque essai.
//
// Tout le bac à sable vit dans .sandbox/ (package.json, config, script de
// thème, appli) avec ses propres dépendances (.sandbox/node_modules).
// Les composants de ../src résolvent leurs propres dépendances (clsx,
// lucide-static, markdown-to-jsx…) depuis le node_modules racine : il faut
// donc aussi un `npm install` à la racine du projet.
// Ce fichier est totalement séparé de ../vite.config.ts (le build de la
// librairie). `npm run build` ne le charge jamais : rien de ce qui
// est ici n'atteint dist/ ni le package publié.
const src = resolve(__dirname, "../src");

export default defineConfig({
  root: __dirname,
  resolve: {
    // Une seule copie de React : celle du bac à sable, y compris pour les
    // composants importés depuis ../src (sinon les hooks cassent).
    dedupe: ["react", "react-dom"],
    alias: {
      $: src,
      $uikit: resolve(src, "components/uikit"),
      $utils: resolve(src, "utils"),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
});
