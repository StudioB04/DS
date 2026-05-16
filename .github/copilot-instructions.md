# Copilot Instructions — @studio_b04/ds

## Commands

```bash
npm start               # Storybook dev server → http://localhost:6006
npm run build           # Clean build to dist/
npm test                # Vitest in watch mode
npm run test:coverage   # Single run with v8 coverage
npm run lint            # ESLint
npm run lint:fix        # ESLint with auto-fix
npm run prettier        # Prettier check
npm run prettier:fix    # Prettier auto-fix
```

**Run a single test file:**
```bash
npx vitest run src/components/uikit/ComponentName/ComponentName.test.tsx
```

The pre-commit hook runs lint → prettier check → full test suite with coverage. All three must pass.

---

## Architecture

This is a **React 19 component library** published as `@studio_b04/ds`. It ships three things: React components, CSS design tokens, and font files.

### Build outputs (`dist/`)

Vite builds multiple ES module entries defined in `vite.config.ts`:

| Entry | Source | Consumer import |
|-------|--------|-----------------|
| `components.js` | `src/components/index.ts` | `@studio_b04/ds/components` |
| `uikit.js` | `src/components/uikit/index.ts` | `@studio_b04/ds/uikit` |
| `styles.css` | `src/styles/themes/tokens.css` | `@studio_b04/ds/styles` |
| `reset.css` | `src/styles/reset.css` | `@studio_b04/ds/reset` |

`vite-plugin-lib-inject-css` bundles each component's CSS into its JS output. `vite-plugin-dts` generates `.d.ts` files. `react`, `react-dom`, `react/jsx-runtime`, and `clsx` are externalized.

### Component structure

Every component lives in its own folder under `src/components/uikit/ComponentName/` with exactly these six files:

```
ComponentName.tsx          # Component implementation
ComponentName.types.ts     # Props interface
ComponentName.css          # Component-scoped styles
ComponentName.test.tsx     # Vitest + Testing Library tests
ComponentName.stories.tsx  # Storybook stories
ComponentName.mdx          # Storybook docs page
```

Export chain: `ComponentName/index.ts` (if present) or direct → `uikit/index.ts` → `components/index.ts` → `src/index.ts`

All three index files start with `"use client";` for Next.js / RSC compatibility.

### CSS token system

**Two-layer token architecture:**

1. **Primitive tokens** (`src/styles/variables/`) — raw values on `:root`
   - `--color-gray-500`, `--ds-spacing-4`, `--ds-radius-md`, etc.

2. **Semantic tokens** (`src/styles/themes/light.css` + `dark.css`) — purpose-based aliases referencing primitives
   - `--ds-text-primary`, `--ds-bg-secondary`, `--ds-border-brand-solid`, etc.

Theme switching uses `data-ds-theme="light|dark"` on `<html>`. The light theme also applies when no attribute is set (SSR-safe). Dark mode also responds to `prefers-color-scheme: dark` via media query.

---

## Key Conventions

### Component implementation
- Props interface goes in `ComponentName.types.ts`, not in the `.tsx` file
- Props always extend the matching HTML element's attributes: `HTMLAttributes<HTMLDivElement>`, `ButtonHTMLAttributes<HTMLButtonElement>`, etc.
- Always spread `...restProps` onto the root element
- Use `clsx` for className composition — always accept and forward a `className` prop
- No default export from index files; named exports only

### CSS class naming
- Root class: `ds-[component-name]` (e.g., `ds-fake-component`)
- Modifier classes: `ds-[component-name]--[modifier]` (BEM-style)
- Always use `ds-` prefix — never raw HTML element selectors in component CSS

### Styling
- Component CSS references semantic tokens (`--ds-text-*`, `--ds-bg-*`, `--ds-border-*`, `--ds-spacing-*`, etc.) — not primitive color tokens
- Primitive tokens (`--color-*`) are for the theme files only

### Testing
- Every component test must include an axe accessibility check as the minimum baseline:
  ```tsx
  const { container } = render(<Component {...requiredProps} />);
  expect(await axe(container)).toHaveNoViolations();
  ```
- `describe` block naming: `"ComponentName component"`
- `vitest-axe` matchers are globally extended in `src/setup-tests.ts`

### TypeScript
- Use `type` imports: `import type { Foo } from "./foo"` (enforced by ESLint)
- No `any` allowed
- Path alias `@` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`)

### Stories
- Story title format: `"Components/uikit/ComponentName"`
- Export `default` as metadata object with `title` and `component`
- Named exports are individual stories typed as `StoryObj<ComponentProps>`

### Release
Releases are triggered manually via GitHub Actions (**Actions → Release → Run workflow**). The workflow runs lint → type-check → tests → build → `npm publish`. Use **Dry run** to test the pipeline without publishing.
