import type { StoryObj } from "@storybook/react-vite";
import { UtilResult, formatCall } from "../../../.storybook/UtilDemo";
import { sortBy } from "./array";

interface User {
  id: number;
  name: string;
  score: number | null;
  birthDate: string;
}

interface ArrayArgs {
  by: keyof User;
  direction: "asc" | "desc";
  type?: "string" | "number" | "date";
}

const users: User[] = [
  { id: 3, name: "Charlie", score: 72, birthDate: "1995-05-12" },
  { id: 1, name: "Alice", score: 91, birthDate: "1990-01-01" },
  { id: 4, name: "Dana", score: null, birthDate: "1988-07-30" },
  { id: 2, name: "Bob", score: 58, birthDate: "2000-11-23" },
];

const defaultArgs: ArrayArgs = {
  by: "name",
  direction: "asc",
  type: "string",
};

const columns = Object.keys(users[0]) as (keyof User)[];

const sortByCall = ({ by, direction, type }: ArrayArgs) =>
  formatCall("sortBy", ["users", by, direction, type]).replace('"users"', "users");

export default {
  title: "Utils/Array",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Helpers for arrays. They are exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { sortBy } from "@studio_b04/ds/utils";\n```',
      },
    },
  },
  argTypes: {
    by: {
      control: "select",
      options: columns,
      description: "The key of the items to sort by.",
    },
    direction: {
      control: "inline-radio",
      options: ["asc", "desc"],
      description: "Ascending or descending order.",
    },
    type: {
      control: "inline-radio",
      options: ["string", "number", "date"],
      description: "How the values of the key are compared.",
    },
  },
};

export const SortBy: StoryObj<ArrayArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          '`sortBy(array, by, direction, type = "string")` returns a new sorted array and leaves the original untouched.\n\n- `string` compares the values with `localeCompare`; `null` and `undefined` count as an empty string.\n- `number` compares the values as numbers; `null` and `undefined` count as `0`.\n- `date` compares the values with `new Date(value)`, so they must be parsable by `Date` (ISO strings for example).\n\nChange the controls to sort the table: pick a `type` that matches the key (`number` for `id` and `score`, `date` for `birthDate`).',
      },
      source: {
        type: "code",
        transform: (_code: string, context: { args: ArrayArgs }) =>
          `import { sortBy } from "@studio_b04/ds/utils";\n\nconst users = ${JSON.stringify(users, null, 2)};\n\n${sortByCall(context.args)};`,
      },
    },
  },
  render: (args) => {
    const { by, direction, type } = args;
    const sorted = sortBy(users, by, direction, type);

    return (
      <UtilResult call={sortByCall(args)}>
        <table style={{ borderCollapse: "collapse", fontFamily: "var(--ds-font-sans)" }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  style={{
                    padding: "var(--ds-spacing-xs) var(--ds-spacing-md)",
                    textAlign: "start",
                    borderBlockEnd: "1px solid var(--ds-border-primary)",
                    fontWeight: column === by ? 700 : 500,
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((user) => (
              <tr key={user.id}>
                {columns.map((column) => (
                  <td key={column} style={{ padding: "var(--ds-spacing-xs) var(--ds-spacing-md)" }}>
                    {String(user[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </UtilResult>
    );
  },
};
