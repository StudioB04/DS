/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
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
    coverage: {
      enabled: true,
      clean: true,
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "text-summary", "json", "html"],
      include: ["src/components/**/*.tsx"],
      exclude: ["**/index.{ts,tsx}", "**/*.{stories,test}.{ts,tsx}"],
    },
  },
  build: {
    cssCodeSplit: false,
    target: "esnext",
    lib: {
      name: "@StudioB04/DS",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        components: resolve(__dirname, "src/components/index.ts"),
        styles: resolve(__dirname, "src/styles/tokens.css"),
        reset: resolve(__dirname, "src/styles/reset.css"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
      },
    },
  },
});
