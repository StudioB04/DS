// Concatène le thème réel du DS (reset + base + tokens + light/dark) en un
// seul fichier CSS statique servi tel quel par le bac à sable, via
// .sandbox/index.html (<link rel="stylesheet" href="/theme.css">) plutôt
// que via un import Vite/Tailwind.
//
// Pourquoi : le moteur CSS de Tailwind (Lightning CSS) a supprimé, à deux
// reprises, une partie du contenu de ces fichiers une fois mêlés à son
// propre traitement — d'abord la totalité de light.css/dark.css (@import
// mal placé une fois inliné), puis une partie seulement de leurs
// déclarations (en dev, silencieusement). Plutôt que de continuer à
// chasser ce comportement, ce script sort entièrement le thème du DS du
// pipeline Tailwind : c'est un fichier statique, non transformé, que le
// navigateur parse directement. Tailwind ne gère plus que la génération
// des classes utilitaires (tailwind-theme.css).
//
// Regénéré automatiquement à chaque lancement de `npm run sandbox`
// (voir le script "theme" dans .sandbox/package.json).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "../src/styles");
const outDir = resolve(__dirname, "public");
const outFile = resolve(outDir, "theme.css");

const IMPORT_RE = /@import\s+url\(["']?(.+?)["']?\)\s*;/g;

// Résout récursivement les @import url("...") d'un fichier CSS en
// inlinant leur contenu (les tokens du DS ne s'importent jamais qu'entre
// eux, en chemins relatifs — pas besoin de résolveur plus complexe).
function resolveImports(filePath, seen = new Set()) {
  if (seen.has(filePath)) return ""; // évite les doublons/boucles
  seen.add(filePath);

  const raw = readFileSync(filePath, "utf8");
  const dir = dirname(filePath);

  return raw.replace(IMPORT_RE, (_match, importPath) => {
    const resolved = resolve(dir, importPath);
    return resolveImports(resolved, seen);
  });
}

// Un seul `seen` partage entre tous les fichiers d'entree : tokens.css
// importe deja light.css et dark.css en interne, donc les lister ici
// aussi ne ferait que les inliner une seconde fois pour rien.
const seen = new Set();
const parts = [
  `/* Fichier genere par .sandbox/build-theme.mjs -- ne pas editer a la main. */`,
  resolveImports(resolve(stylesDir, "reset.css"), seen),
  resolveImports(resolve(stylesDir, "base.css"), seen),
  resolveImports(resolve(stylesDir, "themes/tokens.css"), seen),
];

const content = `@layer base {\n${parts.join("\n\n")}\n}\n`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, content, "utf8");
console.log(`✓ ${outFile} généré (${content.length} octets)`);
