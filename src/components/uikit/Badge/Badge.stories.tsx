import type { StoryObj } from "@storybook/react-vite";
import type { BadgeProps } from "./Badge.types";
import Badge from "./Badge";
import { LucideIconMap } from "$uikit/types";

export default {
  title: "Components/uikit/Badge",
  component: Badge,
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
    variant: {
      control: "select",
      options: [
        "neutral",
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "info",
        "inverse",
        "purple",
        "yellow",
        "pink",
      ],
      description: "The color variant of the Badge.",
    },
    type: {
      control: "select",
      options: ["light", "plain"],
      description: "The type of the Badge.",
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
    label: "Badge",
    size: "md",
    variant: "neutral",
    type: "light",
  },
};
