import type { StoryObj } from "@storybook/react-vite";
import { UtilResult, formatCall, usage } from "../../../.storybook/UtilDemo";
import { formatDate } from "./date";

interface DateArgs {
  locale: string;
  isoDate?: string;
}

const defaultArgs: DateArgs = {
  locale: "fr-FR",
  isoDate: "2026-11-24",
};

export default {
  title: "Utils/Date",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Helpers to display dates. They are exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { formatDate } from "@studio_b04/ds/utils";\n```',
      },
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["fr-FR", "en-US", "en-GB", "es-ES", "de-DE", "it-IT", "ja-JP"],
      description: "The language of the date (BCP 47 tag).",
    },
    isoDate: {
      control: "text",
      description: "A date written `YYYY-MM-DD`. Leave it empty for today's date.",
    },
  },
};

function emptyToUndefined(value?: string): string | undefined {
  return value === "" ? undefined : value;
}

function render({ locale, isoDate }: DateArgs) {
  const date = emptyToUndefined(isoDate);
  let result: string;
  try {
    result = formatDate(locale, date);
  } catch (error) {
    result = error instanceof Error ? `${error.name}: ${error.message}` : "Error";
  }

  return <UtilResult call={formatCall("formatDate", [locale, date])} result={result} />;
}

export const FormatDate: StoryObj<DateArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "`formatDate(locale, isoDate?)` returns the long date in the requested language, with a capital letter on every word (`Mardi 24 Novembre 2026`). A date written `YYYY-MM-DD` is never shifted by the time zone. An invalid date throws a `RangeError`. It uses the Temporal API when the browser provides it, otherwise `Date`; the result is the same.",
      },
      source: usage<DateArgs>("formatDate", ({ locale, isoDate }) => [locale, emptyToUndefined(isoDate)]),
    },
  },
  render,
};

export const Today: StoryObj<DateArgs> = {
  args: { ...defaultArgs, isoDate: "" },
  parameters: {
    docs: {
      description: {
        story: "Without `isoDate`, `formatDate(locale)` returns today's date, in the local time zone.",
      },
      source: usage<DateArgs>("formatDate", ({ locale }) => [locale]),
    },
  },
  render,
};
