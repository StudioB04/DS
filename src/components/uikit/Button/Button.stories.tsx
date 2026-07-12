import type { StoryObj } from "@storybook/react-vite";
import type { ButtonProps } from "./Button.types";
import Button from "./Button";
import { LucideIconMap } from "$uikit/types";

export default {
  title: "Components/uikit/Button",
  component: Button,
  argTypes: {
    label: {
      control: "text",
      description: "The text label of the button. Markdown is supported.",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "success", "error", "warning", "info", "inverse"],
      description: "The color variant of the button.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "The size of the button.",
    },
    shape: {
      control: "inline-radio",
      options: ["square", "pill"],
      description: "The shape of the button.",
    },
    href: {
      control: "text",
      description: "If provided, the button will render as an anchor tag (`<a>`) instead of a button (`<button>`).",
    },
    external: {
      control: "boolean",
      description: "If true, the anchor tag will open in a new tab.",
    },
    loading: {
      control: "boolean",
      description: "If true, the button will show a loading state.",
    },
    disabled: {
      control: "boolean",
      description: "If true, the button will be disabled.",
    },
    block: {
      control: "boolean",
      description: "If true, the button will take the full width of its container.",
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

export const Default: StoryObj<ButtonProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    size: "md",
    type: "button",
    shape: "square",
    href: "",
    external: false,
    loading: false,
    disabled: false,
    block: false,
  },
};

export const Pill: StoryObj<ButtonProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    size: "md",
    type: "button",
    shape: "pill",
    href: "",
    external: false,
    loading: false,
    disabled: false,
    block: false,
  },
};

export const WithIconStart: StoryObj<ButtonProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    size: "md",
    type: "button",
    shape: "square",
    href: "",
    external: false,
    loading: false,
    disabled: false,
    block: false,
    iconStart: "ambulance",
  },
};

export const WithIconOnly: StoryObj<ButtonProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    size: "md",
    type: "button",
    shape: "square",
    href: "",
    external: false,
    loading: false,
    disabled: false,
    block: false,
    iconOnly: "git-pull-request-arrow",
  },
};

export const Loading: StoryObj<ButtonProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    size: "md",
    type: "button",
    shape: "square",
    href: "",
    external: false,
    loading: true,
    disabled: false,
    block: false,
  },
};
