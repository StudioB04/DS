import type { ReactNode } from "react";

export function formatCall(name: string, args: unknown[]): string {
  const trimmed = [...args];
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === undefined) trimmed.pop();

  return `${name}(${trimmed.map((arg) => JSON.stringify(arg)).join(", ")})`;
}

export function usage<Args>(name: string, getArgs: (args: Args) => unknown[]) {
  return {
    type: "code",
    transform: (_code: string, context: { args: Args }) =>
      `import { ${name} } from "@studio_b04/ds/utils";\n\n${formatCall(name, getArgs(context.args))};`,
  };
}

interface UtilResultProps {
  call: string;
  result?: unknown;
  children?: ReactNode;
}

export function UtilResult({ call, result, children }: Readonly<UtilResultProps>) {
  return (
    <div style={{ display: "flex", blockSize: "calc(100vh - 2rem)" }}>
      <div
        style={{
          display: "grid",
          margin: "auto",
          gap: "var(--ds-spacing-md)",
          inlineSize: "min(100%, 40rem)",
          padding: "var(--ds-spacing-xl)",
          color: "var(--ds-text-primary)",
          backgroundColor: "var(--ds-bg-secondary)",
          boxShadow: "var(--ds-box-shadow-md)",
          borderRadius: "var(--ds-radius-lg)",
          fontFamily: "var(--ds-font-mono)",
          overflowWrap: "anywhere",
        }}
      >
        <code style={{ color: "var(--ds-text-secondary)" }}>{call}</code>
        {children ?? <strong>{JSON.stringify(result)}</strong>}
      </div>
    </div>
  );
}
