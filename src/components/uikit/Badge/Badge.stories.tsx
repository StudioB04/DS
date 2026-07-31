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
    type: {
      control: "radio",
      options: ["light", "plain"],
      description: "The type of the Badge.",
    },
    shape: {
      control: "radio",
      options: ["pill", "square"],
      description: "The type of the Badge.",
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
    variant: "primary",
    type: "light",
    shape: "pill",
    iconEnd: undefined,
    iconStart: undefined,
    iconOnly: undefined,
  },
};

export const Square: StoryObj<BadgeProps> = {
  args: {
    label: "Badge",
    size: "md",
    variant: "primary",
    type: "light",
    shape: "square",
    iconEnd: undefined,
    iconStart: undefined,
    iconOnly: undefined,
  },
};

export const Plain: StoryObj<BadgeProps> = {
  args: {
    label: "Badge",
    size: "md",
    variant: "primary",
    type: "plain",
    shape: "pill",
    iconEnd: undefined,
    iconStart: undefined,
    iconOnly: undefined,
  },
};

export const WithIconEnd: StoryObj<BadgeProps> = {
  args: {
    label: "Badge",
    size: "md",
    variant: "primary",
    type: "plain",
    shape: "pill",
    iconEnd: "accessibility",
    iconStart: undefined,
    iconOnly: undefined,
  },
};

export const WithIconOnly: StoryObj<BadgeProps> = {
  args: {
    label: "Badge",
    size: "md",
    variant: "primary",
    type: "plain",
    shape: "pill",
    iconEnd: undefined,
    iconStart: undefined,
    iconOnly: "accessibility",
  },
};
