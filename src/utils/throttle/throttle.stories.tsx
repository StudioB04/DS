import { useMemo, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { UtilResult } from "../../../.storybook/UtilDemo";
import throttle from "./throttle";

interface ThrottleArgs {
  wait: number;
}

const defaultArgs: ThrottleArgs = {
  wait: 500,
};

function ThrottleDemo({ wait }: Readonly<ThrottleArgs>) {
  const [events, setEvents] = useState(0);
  const [calls, setCalls] = useState(0);

  const throttled = useMemo(() => throttle(() => setCalls((current) => current + 1), wait), [wait]);

  return (
    <UtilResult call={`throttle(callback, ${wait})`}>
      <label style={{ display: "grid", gap: "var(--ds-spacing-xs)", fontFamily: "var(--ds-font-sans)" }}>
        Type here quickly
        <input
          type="text"
          autoComplete="off"
          onChange={() => {
            setEvents((current) => current + 1);
            throttled();
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
  title: "Utils/throttle",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Guarantees that a function is invoked at most once every `wait` milliseconds. It is exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { throttle } from "@studio_b04/ds/utils";\n```\n\n`throttle(callback, wait)` returns a function to call instead of the callback. The first call runs the callback immediately. A call made during the following `wait` milliseconds is not lost: the callback runs once the delay is over, with the arguments of that call, and the calls made in between are ignored.\n\nUnlike `debounce`, the callback keeps running at a steady pace while the events continue, which suits scroll and resize handlers.',
      },
    },
  },
  argTypes: {
    wait: {
      control: { type: "range", min: 100, max: 2000, step: 100 },
      description: "The minimum delay between two invocations, in milliseconds.",
    },
  },
};

export const Default: StoryObj<ThrottleArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "Type quickly in the field: the callback is called right away, then at most once every `wait` milliseconds while you keep typing.",
      },
      source: {
        type: "code",
        transform: (_code: string, context: { args: ThrottleArgs }) =>
          `import { throttle } from "@studio_b04/ds/utils";\n\nconst onScroll = throttle(() => updateProgress(), ${context.args.wait});\n\nwindow.addEventListener("scroll", onScroll);`,
      },
    },
  },
  render: ({ wait }) => <ThrottleDemo wait={wait} />,
};
