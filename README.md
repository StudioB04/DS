# @studio_b04/ds

**StudioB04 Design System** — A React component library and CSS token system for building consistent, accessible user interfaces across StudioB04 platforms.

[![npm](https://img.shields.io/npm/v/@studio_b04/ds)](https://www.npmjs.com/package/@studio_b04/ds)
[![license](https://img.shields.io/github/license/StudioB04/DS)](./LICENSE)
[![storybook](https://img.shields.io/badge/storybook-live-ff4785)](https://studiob04.github.io/DS)

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [What's included](#whats-included)
- [CSS Tokens](#css-tokens)
  - [Design tokens](#design-tokens)
  - [Theming](#theming)
  - [Reset](#reset)
  - [Tailwind 4 theme](#tailwind-4-theme)
- [Components](#components)
- [Development](#development)
- [Release](#release)

---

## Requirements

| Peer dependency | Version   |
| --------------- | --------- |
| React           | `^19.0.0` |
| React DOM       | `^19.0.0` |

---

## Installation

```bash
npm install @studio_b04/ds
```

---

## What's included

| Export     | Path in package             | Description                        |
| ---------- | --------------------------- | ---------------------------------- |
| Components | `@studio_b04/ds/components` | React UI components                |
| CSS tokens | `@studio_b04/ds/styles`     | Design tokens (variables + themes) |
| CSS reset  | `@studio_b04/ds/reset`      | Opinionated browser reset          |

---

## CSS Tokens

### Design tokens

Import the full token sheet to get all CSS custom properties on `:root`:

```css
/* In your global CSS */
@import "@studio_b04/ds/styles";
```

This single import includes all token categories:

| Category      | Custom property prefix | Example                                |
| ------------- | ---------------------- | -------------------------------------- |
| Colors        | `--color-*`            | `--color-gray-500`, `--color-teal-400` |
| Spacing       | `--ds-spacing-*`       | `--ds-spacing-4`                       |
| Sizing        | `--ds-size-*`          | `--ds-size-icon-md`                    |
| Border radius | `--ds-radius-*`        | `--ds-radius-md`                       |
| Borders       | `--ds-border-*`        | `--ds-border-primary-default`          |
| Shadows       | `--ds-shadow-*`        | `--ds-shadow-md`                       |
| Typography    | `--ds-font-*`          | `--ds-font-sans`, `--ds-font-lg`       |
| Transitions   | `--ds-transition-*`    | `--ds-transition-regular`              |

**Color palettes available:** Gray · Teal · Fuschia · Green · Yellow · Blue · Red

### Theming

The design system ships with a **light** (default) and **dark** theme using semantic tokens.

**Semantic token categories:**

| Category   | Prefix          | Example                   |
| ---------- | --------------- | ------------------------- |
| Text       | `--ds-text-*`   | `--ds-text-primary`       |
| Background | `--ds-bg-*`     | `--ds-bg-secondary`       |
| Border     | `--ds-border-*` | `--ds-border-primary-1px` |

**Theme switching** is handled via a `data-ds-theme` attribute on a parent element (typically `<html>`):

```html
<!-- Light (default — also applied when no attribute is set, SSR-safe) -->
<html data-ds-theme="light"></html>

<!-- Dark -->
<html data-ds-theme="dark"></html>
```

The dark theme also responds to `@media (prefers-color-scheme: dark)` automatically — no JavaScript required for users with a system dark mode preference.

```tsx
document.documentElement.dataset.dsTheme = "dark";
```

### Reset

An opinionated CSS reset that normalises browser defaults and applies base typographic tokens:

```css
@import "@studio_b04/ds/reset";
```

### Tailwind 4 theme

The package ships a `tailwind-theme.css` inside `dist/` that maps all design tokens into a Tailwind 4 `@theme {}` block. To use it in a consumer project:

```css
/* tailwind.css */
@import "tailwindcss";
@import "@studio_b04/ds/styles"; /* tokens on :root */
@import "@studio_b04/ds/dist/tailwind-theme.css"; /* Tailwind overrides   */
```

This gives you access to all token values as Tailwind utilities:

```html
<p class="text-gray-500 bg-surface rounded-md shadow-sm transition-base">…</p>
```

---

## Fonts

By default, DS come with standard font for sans, serif and mono. But they can be overwritten in CSS, example :

```css
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300..900&display=swap") layer(fonts);
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@400..600&display=swap") layer(fonts);
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap")
layer(fonts);

@layer fonts {
  :root {
    --ds-font-family-sans: "Red Hat Display";
    --ds-font-family-mono: "Red Hat Mono";
    --ds-font-family-serif: "Noto Serif";
  }
}
```

---

## Components

> 📖 **All components are documented and interactive in [Storybook](https://studiob04.github.io/DS).**

Components are exported from two sub-paths:

```ts
// All components
import { FakeComponent } from "@studio_b04/ds/components";

// UIKit components only
import { FakeComponent } from "@studio_b04/ds/uikit";
```

All components:

- Are React 19 functional components
- Are marked `"use client"` for Next.js / RSC compatibility
- Extend the relevant HTML element's props (`HTMLAttributes<…>`)
- Use `clsx` for class composition and accept a `className` prop
- Are accessibility-tested with `vitest-axe`

---

## Development

```bash
# Install dependencies
npm install

# Start Storybook (component explorer)
npm start          # → http://localhost:6006

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint
npm run lint:fix

# Format
npm run prettier
npm run prettier:fix
```

**Tech stack:**

| Tool                         | Role                                       |
| ---------------------------- | ------------------------------------------ |
| Vite + `vite-plugin-dts`     | Library build + type declarations          |
| `vite-plugin-lib-inject-css` | Per-component CSS injection                |
| Storybook 10                 | Component documentation                    |
| Vitest + Testing Library     | Unit & accessibility tests                 |
| ESLint + typescript-eslint   | Linting                                    |
| Prettier                     | Formatting                                 |
| Husky                        | Pre-commit hooks (lint → prettier → tests) |

---

## Release

Releases are published to npm manually via the **GitHub Actions** workflow.

1. Go to **Actions** → **Release** → **Run workflow**
2. Choose a version bump (`patch` / `minor` / `major`) or enter an exact version
3. Optionally check **Dry run** to test the full pipeline without publishing

The workflow runs lint → type check → tests → build → `npm publish`, then creates a GitHub Release with auto-generated notes.
