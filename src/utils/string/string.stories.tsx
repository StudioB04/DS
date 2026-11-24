import type { StoryObj } from "@storybook/react-vite";
import { UtilResult, formatCall, usage } from "../../../.storybook/UtilDemo";
import { camelCase, capitalize, getInitials, humanize, kebabCase, pascalCase, slugify, snakeCase } from "./string";

interface StringArgs {
  value: string;
  length?: number;
}

const defaultArgs: StringArgs = {
  value: "Lorem Ipsum",
};

export default {
  title: "Utils/String",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Helpers to convert and format strings. They are exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { slugify, camelCase, snakeCase, kebabCase, pascalCase, getInitials, humanize, capitalize } from "@studio_b04/ds/utils";\n```\n\nEvery function returns an empty string when no string is given. Change the `value` control of a story to try your own text.',
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "The string to convert.",
    },
    length: {
      control: { type: "number", min: 1 },
      description: "Maximum number of initials.",
    },
  },
};

export const Slugify: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "Crème Brûlée à la Vanille !" },
  parameters: {
    docs: {
      description: {
        story:
          "`slugify(string)` returns a clean, URL-friendly slug: camelCase words are split, accents are removed, the text is lowercased and every run of spaces, underscores, hyphens or special characters becomes a single hyphen with none at the start or the end.",
      },
      source: usage<StringArgs>("slugify", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("slugify", [value])} result={slugify(value)} />,
};

export const CamelCase: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "lorem-ipsum_dolor sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`camelCase(string)` removes special characters, treats hyphens, underscores and spaces as word separators and returns the words joined in camelCase (`loremIpsumDolorSit`).",
      },
      source: usage<StringArgs>("camelCase", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("camelCase", [value])} result={camelCase(value)} />,
};

export const PascalCase: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "lorem-ipsum_dolor sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`pascalCase(string)` works like `camelCase` but the first letter is uppercase too (`LoremIpsumDolorSit`).",
      },
      source: usage<StringArgs>("pascalCase", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("pascalCase", [value])} result={pascalCase(value)} />,
};

export const SnakeCase: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "loremIpsum dolor-sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`snakeCase(string)` splits camelCase words, turns spaces and hyphens into underscores, removes the other special characters and lowercases everything (`lorem_ipsum_dolor_sit`).",
      },
      source: usage<StringArgs>("snakeCase", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("snakeCase", [value])} result={snakeCase(value)} />,
};

export const KebabCase: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "loremIpsum dolor_sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`kebabCase(string)` splits camelCase words, turns spaces and underscores into hyphens, removes the other special characters and lowercases everything (`lorem-ipsum-dolor-sit`).",
      },
      source: usage<StringArgs>("kebabCase", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("kebabCase", [value])} result={kebabCase(value)} />,
};

export const Humanize: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "loremIpsum_dolor-sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`humanize(string)` turns an identifier (camelCase, PascalCase, snake_case or kebab-case) into lowercase words separated by single spaces (`lorem ipsum dolor sit`).",
      },
      source: usage<StringArgs>("humanize", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("humanize", [value])} result={humanize(value)} />,
};

export const Capitalize: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "lorem ipsum dolor sit" },
  parameters: {
    docs: {
      description: {
        story:
          "`capitalize(string, locale?)` puts a capital letter on every space-separated word and leaves the rest of each word as it is (`Lorem Ipsum Dolor Sit`). The optional `locale` drives the case conversion.",
      },
      source: usage<StringArgs>("capitalize", ({ value }) => [value]),
    },
  },
  render: ({ value }) => <UtilResult call={formatCall("capitalize", [value])} result={capitalize(value)} />,
};

export const GetInitials: StoryObj<StringArgs> = {
  args: { ...defaultArgs, value: "Thomas Pierre Durand", length: 2 },
  parameters: {
    docs: {
      description: {
        story:
          "`getInitials(string, length = 2)` returns the uppercase first letters of the first `length` words, which is handy for avatars.",
      },
      source: usage<StringArgs>("getInitials", ({ value, length }) => [value, length]),
    },
  },
  render: ({ value, length }) => (
    <UtilResult call={formatCall("getInitials", [value, length])} result={getInitials(value, length)} />
  ),
};
