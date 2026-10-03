import type { StoryObj } from "@storybook/react-vite";
import type { BadgeProps } from "./Badge.types";
import Badge from "./Badge";
import { LucideIconMap } from "$uikit/types";

const defaultArgs: BadgeProps = {
  label: "Badge",
  variant: "neutral",
  size: "md",
  type: "light",
  shape: "pill",
  iconStart: undefined,
  iconEnd: undefined,
  iconOnly: undefined,
};

export default {
  title: "Components/uikit/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "A compact label to display a status, a category or metadata. The label supports markdown.\n\nIt comes in 3 `type`s (`light`: tinted background, `plain`: solid background, `clear`: outlined), 2 `shape`s (`pill`, `square`), 3 `size`s and every color `variant`. Add icons with `iconStart` / `iconEnd`, or replace the label with `iconOnly`.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The text label of the Badge. Markdown is supported.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "The size of the Badge.",
    },
    type: {
      control: "radio",
      options: ["light", "plain", "clear"],
      description: "The type of the Badge.",
    },
    shape: {
      control: "radio",
      options: ["pill", "square"],
      description: "The type of the Badge.",
    },
    variant: {
      control: "select",
      options: ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink"],
      description: "The color variant of the Badge.",
    },
    iconStart: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display at the start of the button.",
    },
    iconEnd: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display at the end of the button.",
    },
    iconOnly: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display when the button has no label.",
    },
  },
};

export const Default: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    variant: "brand",
  },
};

export const Square: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    variant: "brand",
    shape: "square",
  },
};

export const Plain: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    variant: "brand",
    type: "plain",
  },
};

export const WithIconEnd: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    variant: "brand",
    type: "plain",
    iconEnd: "accessibility",
  },
};

export const WithIconOnly: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    variant: "brand",
    type: "plain",
    iconOnly: "accessibility",
  },
};
