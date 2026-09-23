/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Plugin } from "vite";

/**
 * Rollup strips module-level directives ("use client", "use server") when
 * bundling, since they only make sense per-file. With `preserveModules: true`
 * each source module maps to its own output chunk, so we can safely restore
 * the directive on the matching chunk after the fact. Without this, none of
 * the "use client" directives in src/components/uikit/**\/*.tsx survive the
 * build, which breaks consumption from Next.js App Router / RSC.
 */
function preserveUseClientDirective(): Plugin {
  const clientModules = new Set<string>();

  return {
    name: "preserve-use-client-directive",
    transform(code, id) {
      if (/^\s*["']use client["'];?/.test(code)) {
        clientModules.add(id);
      }
      return null;
    },
    renderChunk(code, chunk) {
      const isClientChunk =
        Boolean(chunk.facadeModuleId && clientModules.has(chunk.facadeModuleId)) ||
        chunk.moduleIds.some((id) => clientModules.has(id));

      if (!isClientChunk || /^\s*["']use client["'];?/.test(code)) {
        return null;
      }

      return { code: `"use client";\n${code}`, map: null };
    },
  };
}

const textExclusion = [
  "**/node_modules/**",
  "src/setup-tests.ts",
  "src/components/**/*.{css,scss,less}",
  "src/components/**/*.stories.{ts,tsx}",
  "src/components/**/*.types.{ts,tsx}",
  "src/components/uikit/Loader/loaders/**",
  "**/index.{ts,tsx}",
  "**/types.{ts,tsx}",
  "vite-env.d.ts",
  "vitest.d.ts",
];

export default defineConfig({
  resolve: {
    alias: {
      $: resolve(__dirname, "src"),
      $uikit: resolve(__dirname, "src/components/uikit"),
      $utils: resolve(__dirname, "src/utils"),
    },
  },
  plugins: [
    react(),
    dts({
      outDir: "dist",
      include: ["src"],
      exclude: ["src/setup-tests.ts", "**/*.stories.*", "**/*.test.*"],
    }),
    libInjectCss(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    setupFiles: ["./src/setup-tests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: textExclusion,
    coverage: {
      enabled: true,
      clean: true,
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "text-summary", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: textExclusion,
    },
  },
  build: {
    cssCodeSplit: true,
    target: "esnext",
    lib: {
      name: "@StudioB04/DS",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        uikit: resolve(__dirname, "src/components/uikit/index.ts"),
        utils: resolve(__dirname, "src/utils/index.ts"),
        hooks: resolve(__dirname, "src/hooks/index.ts"),
        tokens: resolve(__dirname, "src/styles/themes/tokens.css"),
        reset: resolve(__dirname, "src/styles/reset.css"),
        "tailwind-theme": resolve(__dirname, "src/styles/tailwind-theme.css"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "clsx"],
      plugins: [preserveUseClientDirective()],
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
