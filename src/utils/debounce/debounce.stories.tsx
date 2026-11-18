import { useEffect, useMemo, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { UtilResult } from "../../../.storybook/UtilDemo";
import debounce from "./debounce";

interface DebounceArgs {
  wait: number;
}

const defaultArgs: DebounceArgs = {
  wait: 500,
};

function DebounceDemo({ wait }: Readonly<DebounceArgs>) {
  const [events, setEvents] = useState(0);
  const [calls, setCalls] = useState(0);

  const debounced = useMemo(() => debounce(() => setCalls((current) => current + 1), wait), [wait]);

  useEffect(() => () => debounced.cancel(), [debounced]);

  return (
    <UtilResult call={`debounce(callback, ${wait})`}>
      <label style={{ display: "grid", gap: "var(--ds-spacing-xs)", fontFamily: "var(--ds-font-sans)" }}>
        Type here quickly
        <input
          type="text"
          autoComplete="off"
          onChange={() => {
            setEvents((current) => current + 1);
            debounced();
          }}
        />
      </label>
      <output>
        <strong>{events}</strong> input events, <strong>{calls}</strong> callback calls
      </output>
    </UtilResult>
  );
}

export default {
  title: "Utils/debounce",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Guarantees that a callback is invoked only after a period of inactivity. It is exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { debounce } from "@studio_b04/ds/utils";\n```\n\n`debounce(callback, wait)` returns a function to call instead of the callback. Each call restarts a timer of `wait` milliseconds and the callback runs with the arguments of the last call, once the timer is over. The returned function has a `cancel()` method that drops the pending call.',
      },
    },
  },
  argTypes: {
    wait: {
      control: { type: "range", min: 100, max: 2000, step: 100 },
      description: "The delay of inactivity, in milliseconds.",
    },
  },
};

export const Default: StoryObj<DebounceArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "Type in the field: the callback is called only once you stop typing for `wait` milliseconds, however many characters were entered.",
      },
      source: {
        type: "code",
        transform: (_code: string, context: { args: DebounceArgs }) =>
          `import { debounce } from "@studio_b04/ds/utils";\n\nconst search = debounce((query: string) => fetchResults(query), ${context.args.wait});\n\ninput.addEventListener("input", (event) => search(event.target.value));\n\nsearch.cancel();`,
      },
    },
  },
  render: ({ wait }) => <DebounceDemo wait={wait} />,
};
