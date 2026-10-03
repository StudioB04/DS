import type { StoryObj } from "@storybook/react-vite";
import type { DividerProps } from "./Divider.types";
import Divider from "./Divider";

const VARIANTS = ["primary", "secondary", "tertiary"];

const paragraph =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.";

export default {
  title: "Components/uikit/Divider",
  component: Divider,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "The color of the line: `primary` (strongest) → `tertiary` (lightest).",
    },
    size: {
      control: "inline-radio",
      options: ["0", "sm", "md", "lg"],
      description: "The space around the line (above/below, or left/right when vertical).",
    },
    vertical: {
      control: "boolean",
      description: "Draws a vertical line, to be used inside a flex container.",
    },
  },
};

export const Default: StoryObj<DividerProps> = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: args.vertical ? "row" : "column" }}>
      <p>{paragraph}</p>
      <Divider {...args} />
      <p>{paragraph}</p>
    </div>
  ),
  args: {
    variant: "primary",
    size: "md",
    vertical: false,
  },
};

export const Variants: StoryObj<DividerProps> = {
  render: (args) => (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <p>{variant}</p>
          <Divider {...args} variant={variant as DividerProps["variant"]} />
        </div>
      ))}
    </div>
  ),
  args: {
    size: "sm",
  },
};

export const Sizes: StoryObj<DividerProps> = {
  render: (args) => (
    <div>
      <p>None (0)</p>
      <Divider {...args} size="0" />
      <p>Small</p>
      <Divider {...args} size="sm" />
      <p>Medium</p>
      <Divider {...args} size="md" />
      <p>Large</p>
      <Divider {...args} size="lg" />
      <p>End</p>
    </div>
  ),
  args: {
    variant: "primary",
  },
};

export const Vertical: StoryObj<DividerProps> = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>Home</span>
      <Divider {...args} />
      <span>Products</span>
      <Divider {...args} />
      <span>Contact</span>
    </div>
  ),
  args: {
    variant: "primary",
    size: "sm",
    vertical: true,
  },
};
