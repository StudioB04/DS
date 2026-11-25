import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { StoryObj } from "@storybook/react-vite";
import themeCss from "./themes/theme.css?raw";

type Kind = "fill" | "text" | "border";

interface TokenGroup {
  title: string;
  tokens: string[];
}

const FAMILIES = ["gray", "fuschia", "teal", "green", "orange", "blue", "red", "purple"];
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const PROPERTY: Record<Kind, "backgroundColor" | "color" | "borderTopColor"> = {
  fill: "backgroundColor",
  text: "color",
  border: "borderTopColor",
};

const PALETTE_GROUPS: TokenGroup[] = [
  ...FAMILIES.map((family) => ({
    title: family,
    tokens: STEPS.map((step) => `--ds-color-${family}-${step}`),
  })),
];

const LEVEL_NAMES = ["primary", "secondary", "tertiary", "solid", "solid_hover"];
const FAMILY_PATTERN = new RegExp(`^(.+)-(?:${LEVEL_NAMES.join("|")})$`);

function groupTokens(category: "text" | "bg" | "border"): TokenGroup[] {
  const prefix = `--ds-${category}-`;
  const pattern = new RegExp(`^\\s*(${prefix}[\\w-]+)\\s*:`, "gm");
  const groups = new Map<string, string[]>();

  for (const [, token] of themeCss.matchAll(pattern)) {
    const name = token.slice(prefix.length);
    const family = LEVEL_NAMES.includes(name) ? "neutral" : (FAMILY_PATTERN.exec(name)?.[1] ?? "other");
    groups.set(family, [...(groups.get(family) ?? []), token]);
  }

  const other = groups.get("other");
  groups.delete("other");

  return [...groups, ...(other ? [["other", other] as const] : [])].map(([title, tokens]) => ({ title, tokens }));
}

const TEXT_GROUPS = groupTokens("text");
const BACKGROUND_GROUPS = groupTokens("bg");
const BORDER_GROUPS = groupTokens("border");

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
  gap: "var(--ds-spacing-md)",
};

function toHex(color: string) {
  const match = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(color);
  if (!match) return color;

  const hex = match
    .slice(1, 4)
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("");

  return match[4] === undefined ? `#${hex}` : `#${hex} · ${Math.round(Number(match[4]) * 100)}%`;
}

function previewBackground(token: string) {
  const inverse = /^--ds-(?:text|border)-inverse-(primary|secondary|tertiary|solid)$/.exec(token);
  return inverse ? "var(--ds-bg-inverse-primary)" : "var(--ds-bg-primary)";
}

function useThemeVersion() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((current) => current + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ds-theme"] });

    return () => observer.disconnect();
  }, []);

  return version;
}

interface SwatchProps {
  token: string;
  kind: Kind;
  themeVersion: number;
}

function Swatch({ token, kind, themeVersion }: Readonly<SwatchProps>) {
  const sampleRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sampleRef.current) setValue(toHex(getComputedStyle(sampleRef.current)[PROPERTY[kind]]));
  }, [kind, themeVersion]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1200);

    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = () => {
    navigator.clipboard
      ?.writeText(`var(${token})`)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  const sampleStyle: CSSProperties = {
    display: "grid",
    placeItems: "center",
    blockSize: "var(--ds-size-56px)",
    borderRadius: "var(--ds-radius-sm)",
    border: "var(--ds-size-1px) solid var(--ds-border-primary)",
    fontSize: "var(--ds-font-size-text-lg)",
    fontWeight: "var(--ds-font-weight-semibold)",
    ...(kind === "fill" && { backgroundColor: `var(${token})` }),
    ...(kind === "text" && { color: `var(${token})`, backgroundColor: previewBackground(token) }),
    ...(kind === "border" && {
      border: `var(--ds-size-4px) solid var(${token})`,
      backgroundColor: previewBackground(token),
    }),
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy var(${token})`}
      style={{
        display: "grid",
        gap: "var(--ds-spacing-xs)",
      }}
    >
      <span ref={sampleRef} style={sampleStyle}>
        {kind === "text" && "Lorem Ipsum"}
      </span>
      <code
        style={{ fontFamily: "var(--ds-font-mono)", fontSize: "var(--ds-font-size-text-xs)", overflowWrap: "anywhere" }}
      >
        {copied ? "Copied!" : token}
      </code>
      <span style={{ color: "var(--ds-text-secondary)", fontSize: "var(--ds-font-size-text-xs)" }}>{value}</span>
    </button>
  );
}

interface TokenSectionsProps {
  groups: TokenGroup[];
  kind: Kind;
}

function TokenSections({ groups, kind }: Readonly<TokenSectionsProps>) {
  const themeVersion = useThemeVersion();

  return (
    <div style={{ display: "grid", gap: "var(--ds-spacing-3xl)", inlineSize: "100%" }}>
      {groups.map((group) => (
        <section key={group.title} style={{ display: "grid", gap: "var(--ds-spacing-md)" }}>
          <h3
            style={{
              margin: 0,
              color: "var(--ds-text-primary)",
              fontFamily: "var(--ds-font-sans)",
              fontSize: "var(--ds-font-size-text-lg)",
              fontWeight: "var(--ds-font-weight-semibold)",
              textTransform: "capitalize",
            }}
          >
            {group.title}
          </h3>
          <div style={gridStyle}>
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} kind={kind} themeVersion={themeVersion} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CodeBlock({ code }: Readonly<{ code: string }>) {
  return (
    <pre
      style={{
        margin: 0,
        padding: "var(--ds-spacing-xl)",
        overflowX: "auto",
        color: "var(--ds-text-primary)",
        backgroundColor: "var(--ds-bg-secondary)",
        borderRadius: "var(--ds-radius-lg)",
        fontFamily: "var(--ds-font-mono)",
        fontSize: "var(--ds-font-size-text-sm)",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

const CSS_USAGE = `.card {
  color: var(--ds-text-primary);
  background-color: var(--ds-bg-secondary);
  border: 1px solid var(--ds-border-primary);
}

.card:hover {
  background-color: var(--ds-bg-brand-solid_hover);
}`;

const TAILWIND_USAGE = `<div class="text-primary bg-secondary border border-primary hover:bg-brand-solid_hover">
  …
</div>`;

const THEME_USAGE = `<html data-ds-theme="dark">…</html>`;

function Usage() {
  return (
    <div style={{ display: "grid", gap: "var(--ds-spacing-xl)", inlineSize: "min(100%, 48rem)" }}>
      <CodeBlock code={CSS_USAGE} />
      <CodeBlock code={TAILWIND_USAGE} />
      <CodeBlock code={THEME_USAGE} />
    </div>
  );
}

export default {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Colors are built in two layers. The **palette** (`--ds-color-*`) holds the raw values and never changes with the theme. The **semantic tokens** (`--ds-text-*`, `--ds-bg-*`, `--ds-border-*`) say what a color is for and point to the palette with `light-dark()`, so a single definition follows the theme: the operating system by default, or the `data-ds-theme` attribute on `<html>` (use the theme toolbar to switch). Components only use semantic tokens.\n\nClick a swatch to copy its `var()` reference.",
      },
    },
  },
};

export const Palette: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Ten families from 50 to 950. These values are the same in light and dark: use them to define semantic tokens, not directly in components.",
      },
      source: { type: "code", code: "background-color: var(--ds-color-fuschia-500);" },
    },
  },
  render: () => <TokenSections groups={PALETTE_GROUPS} kind="fill" />,
};

export const Text: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Text colors. `primary`, `secondary` and `tertiary` go from the strongest to the lightest emphasis, for the neutral text and for each color family. The `inverse` ones are for text placed on `bg-inverse-*` surfaces. `info`, `error`, `warning` and `success` are shortcuts to the `primary` text of `blue`, `red`, `orange` and `green`.",
      },
      source: { type: "code", code: "color: var(--ds-text-secondary);" },
    },
  },
  render: () => <TokenSections groups={TEXT_GROUPS} kind="text" />,
};

export const Backgrounds: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Background colors. `primary` to `tertiary` are tinted surfaces and `solid` is the full color, with a `solid_hover` variant for interactive elements. The `inverse` family flips with the theme: dark in light mode, light in dark mode.",
      },
      source: { type: "code", code: "background-color: var(--ds-bg-brand-solid);" },
    },
  },
  render: () => <TokenSections groups={BACKGROUND_GROUPS} kind="fill" />,
};

export const Borders: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Border colors. For each family, `primary`, `secondary` and `tertiary` go from the strongest tint to the lightest, `solid` is the full color and `solid_hover` is its hover state. `info`, `error`, `warning` and `success` are aliases of `blue`, `red`, `orange` and `green`. Shorthands such as `--ds-border-primary-2px` (width, style and color in one value) exist for 1 to 4 px.",
      },
      source: { type: "code", code: "border: var(--ds-border-primary-1px);" },
    },
  },
  render: () => <TokenSections groups={BORDER_GROUPS} kind="border" />,
};

export const UsageExamples: StoryObj = {
  name: "Usage",
  parameters: {
    docs: {
      description: {
        story:
          "In CSS, reference the semantic tokens with `var()`. With the Tailwind theme (`@studio_b04/ds/tailwind-theme`), the same tokens are available as utilities. Force a theme with the `data-ds-theme` attribute.",
      },
      source: { type: "code", code: CSS_USAGE },
    },
  },
  render: () => <Usage />,
};
