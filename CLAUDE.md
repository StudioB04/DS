# CLAUDE.md — @studio_b04/ds

React 19 design system for StudioB04 websites, published to npm as `@studio_b04/ds`.
Storybook: https://studiob04.github.io/DS

## Commands

```bash
npm start                 # Storybook → http://localhost:6006
npm run sandbox:install   # once: installs .sandbox/ own deps (React, Vite, Tailwind)
npm run sandbox           # Local Vite + Tailwind playground (.sandbox/), imports src/ directly
npm run build             # Clean + vite build → dist/
npm test                  # Vitest (watch)
npm run test:coverage     # Single run + v8 coverage → coverage/
npx vitest run src/components/uikit/Button/Button.test.tsx   # one file
npm run lint / lint:fix   # ESLint (type-checked, sonarjs, jsx-a11y)
npm run prettier:fix      # Prettier (printWidth 120, double quotes, trailing commas)
npx tsc --project tsconfig.eslint.json --noEmit              # type check (as CI does)
```

Husky pre-commit runs: build → lint:fix → prettier:fix → test:coverage.
Release: GitHub Actions → "Release" workflow (manual, patch/minor/major, dry-run option). Never bump the version by hand.

## Layout

```
src/
  index.ts                     # "use client" — currently empty
  types.ts                     # shared types: Size ("sm"|"md"|"lg"), Variant (11 colors), ButtonOrLinkProps
  components/uikit/
    index.ts                   # "use client"; `export { default as X } from "./X/X"` (alphabetical)
    types.ts                   # "use client"; `export * from "./X/X.types"` (alphabetical)
    <Component>/               # one folder per component (see below)
  utils/                       # pure helpers (string.ts: slugify, camelCase, …) + index.ts barrel
  hooks/index.ts               # empty for now (built as entry, not in package exports)
  styles/
    variables/*.css            # primitive tokens on :root (colors, spacing, size, radius, typography, shadows, borders, transitions)
    themes/light.css, dark.css # semantic tokens (--ds-text-*, --ds-bg-*, --ds-border-*, focus ring)
    themes/tokens.css          # aggregates variables + light + dark  → export "./styles"
    reset.css                  # → export "./reset"
    base.css                   # body colors, focus-visible ring, print, [popover]
    tailwind-theme.css         # Tailwind 4 @theme mapping → export "./tailwind-theme"
.storybook/                    # Storybook 10; theme toolbar sets data-ds-theme on <html>
.sandbox/                      # self-contained dev playground with its OWN package.json/node_modules, never shipped
                               # excluded from root ESLint + tsconfig.eslint.json; `npm run typecheck` inside it
  vite.config.ts               # sandbox Vite config (root = .sandbox, aliases → ../src)
  build-theme.mjs              # inlines DS CSS into .sandbox/public/theme.css (outside Tailwind pipeline)
  App.tsx, main.tsx, index.html, index.css, tsconfig.json
```

Path aliases (tsconfig + vite): `$/*` → `src/*`, `$uikit` → `src/components/uikit`, `$utils` → `src/utils`.
Package exports: `.`, `./uikit`, `./utils`, `./styles`, `./reset`, `./tailwind-theme`.
Build: Vite lib mode, ES only, `preserveModules`, `vite-plugin-lib-inject-css` (each component's CSS is imported by its JS), `vite-plugin-dts`. Externals: react, react-dom, react/jsx-runtime, clsx.

## Component anatomy

`src/components/uikit/<Name>/`:

| File | Content |
|---|---|
| `<Name>.tsx` | `export default function <Name>(…)`; imports `./<Name>.css` |
| `<Name>.types.ts` | `export interface <Name>Props extends <HTML attrs of root element>` |
| `<Name>.css` | `.ds-<name>` block, BEM modifiers, local CSS vars |
| `<Name>.test.tsx` | Vitest + Testing Library + axe |
| `<Name>.stories.tsx` | `title: "Components/uikit/<Name>"`, `StoryObj<<Name>Props>` |
| `<Name>.mdx` | Storybook docs page (`<Meta of={Stories} />`, Canvas, Controls, usage snippets) |
| `<Name>.utils.ts` | optional helpers (e.g. FocusTrap) |

Then register in `uikit/index.ts` and `uikit/types.ts`.

### Comments
- Don't add comments (JSDoc, CSS or inline) unless the user asks. Keep the existing ones as they are.

### TSX conventions
- Destructure props with defaults in the signature (`size = "md"`, `variant = "brand"` / `"neutral"`), pull out `className`, spread `...restProps` last on the root.
- Classes via `clsx`: `"ds-x"`, `` `ds-x--size-${size}` ``, `` `ds-x--variant-${variant}` ``, boolean modifiers `flag && "ds-x--flag"`, then `className`.
- Text labels go through `<Markdown allowTags={["strong","em","br"]}>` (label is a required `string`).
- Icons: `<Icon src="lucide-name" />` (lucide-static sprite; also accepts a sprite URL or inline `<svg>` string). Icon props are `iconStart` / `iconEnd` / `iconOnly`.
- Button/Link polymorphism: `const C = (href ? "a" : "button") as ElementType`; `external` → `target="_blank"` + `rel="noopener noreferrer"` + external-link icon.
- Internal imports use aliases: `import Icon from "$uikit/Icon/Icon"`, `import type { Variant, Size } from "$/types"`.
- `import type` is mandatory (ESLint). No `any`.

### CSS conventions
- Root `.ds-<name>`, elements `.ds-<name>__<el>`, modifiers `.ds-<name>--<prop>-<value>`. Never style bare HTML selectors.
- Native CSS nesting (`&`). Section comments `/* ##### SIZE ##### */`, `SHAPE`, `TYPE`, `VARIANTS`.
- Pattern: modifiers only set component-local custom props (`--ds-<name>-color`, `--ds-<name>-background-color`, `…_hover`, `--ds-<name>-font-size`, `--ds-<name>-padding-inline`); the root rule consumes them.
- Use semantic tokens only (`--ds-text-*`, `--ds-bg-*`, `--ds-border-*`) + scale tokens (`--ds-spacing-*`, `--ds-size-Npx`, `--ds-radius-*`, `--ds-font-size-text-*`, `--ds-font-weight-*`, `--ds-transition-*`). Never `--color-*` in components.
- Logical properties (`inline-size`, `block-size`, `padding-inline`, `margin-inline-start`).
- Every `Variant` needs a rule: neutral, brand, alt, green, red, orange, blue, purple, yellow, pink. Solid fills use `--ds-bg-<v>-solid` (+ `_hover`) with `--ds-text-white` (yellow → dark text); tinted fills use `--ds-bg-<v>-primary` + `--ds-text-<v>` + `--ds-border-<v>-solid`.

### Tests
- `describe("<Name> component")`; first test is axe: `expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations()`.
- Then default classes, each modifier (`it.each` over variants), conditional elements (`.ds-x__icon--start`), a11y attributes.

## Theming
Light by default (and via `prefers-color-scheme`), dark via `prefers-color-scheme: dark` unless `data-ds-theme="light"`; explicit `data-ds-theme="light|dark"` on `<html>` always wins.

## Known inconsistencies (to be aware of)
- `.github/copilot-instructions.md` is partly outdated (mentions `components.js`, `src/components/index.ts`, `styles.css`, `@` alias). This file reflects the actual code.
- `Button.types.ts` / `Link.types.ts` type icons as `IconProps["name"]` (= loose `string`); `Badge` uses `LucideIconName` (strict). Prefer `LucideIconName`.
- `Badge` / `Notification` props extend `HTMLAttributes<HTMLDivElement>` but render a `<span>`.
- `Loader.types.tsx` / `Notification.types.tsx` use `.tsx` instead of `.ts`.
- `FocusTrap` exists but is not exported from `uikit/index.ts`.
