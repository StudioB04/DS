/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import tsconfigPaths from "vite-tsconfig-paths";

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
    cssCodeSplit: false,
    target: "esnext",
    lib: {
      name: "@StudioB04/DS",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        uikit: resolve(__dirname, "src/components/uikit/index.ts"),
        tokens: resolve(__dirname, "src/styles/themes/tokens.css"),
        reset: resolve(__dirname, "src/styles/reset.css"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "clsx"],
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
      },
    },
  },
});
