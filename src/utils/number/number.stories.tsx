import type { StoryObj } from "@storybook/react-vite";
import { UtilResult, formatCall, usage } from "../../../.storybook/UtilDemo";
import { shorten, shortenFileSize } from "./number";

interface NumberArgs {
  value: number;
  decimal?: number;
}

const defaultArgs: NumberArgs = {
  value: 1550000,
  decimal: 2,
};

export default {
  title: "Utils/Number",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Helpers to display numbers in a compact form. They are exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { shorten, shortenFileSize } from "@studio_b04/ds/utils";\n```',
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description: "The number to format.",
    },
    decimal: {
      control: { type: "number", min: 0, max: 10 },
      description: "Number of decimals to keep.",
    },
  },
};

export const Shorten: StoryObj<NumberArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "`shorten(number, decimal = 2)` returns a short string for a large number, with a `K` (thousands), `M` (millions) or `B` (billions) suffix. From a trillion, the number is written in exponential notation (`1.55e+12`). The sign of negative numbers is kept and numbers under a thousand are returned as they are.",
      },
      source: usage<NumberArgs>("shorten", ({ value, decimal }) => [value, decimal]),
    },
  },
  render: ({ value, decimal }) => (
    <UtilResult call={formatCall("shorten", [value, decimal])} result={shorten(value, decimal)} />
  ),
};

export const ShortenFileSize: StoryObj<NumberArgs> = {
  args: { ...defaultArgs, value: 1980987 },
  parameters: {
    docs: {
      description: {
        story:
          "`shortenFileSize(size, decimal = 2)` formats a size in bytes with the unit that fits (`B`, `Kb`, `Mb`, `Gb`, `Tb` or `Pb`, with 1024 as the base). A size that is a round number has no decimals (`1 Kb`). It throws an error when the size is negative.",
      },
      source: usage<NumberArgs>("shortenFileSize", ({ value, decimal }) => [value, decimal]),
    },
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0 },
      description: "The size in bytes.",
    },
  },
  render: ({ value, decimal }) => (
    <UtilResult call={formatCall("shortenFileSize", [value, decimal])} result={shortenFileSize(value, decimal)} />
  ),
};
