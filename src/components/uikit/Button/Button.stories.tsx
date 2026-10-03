import type { StoryObj } from "@storybook/react-vite";
import type { ButtonProps } from "./Button.types";
import Button from "./Button";
import { LucideIconMap } from "$uikit/types";

const defaultArgs: ButtonProps = {
  label: "click **me** !",
  variant: "brand",
  size: "md",
  type: "button",
  shape: "square",
  href: "",
  external: false,
  loading: false,
  disabled: false,
  block: false,
  iconStart: undefined,
  iconEnd: undefined,
  iconOnly: undefined,
};

export default {
  title: "Components/uikit/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Renders a `<button>` by default, or an `<a>` when `href` is provided. With `external`, the link opens in a new tab (`rel="noopener noreferrer"`) and gets an external-link icon. The label supports markdown (`strong`, `em`, `br`) and is used as the default `title`.\n\n`loading` shows a loader overlay and disables the button. Use `iconStart` / `iconEnd` for icons, `iconOnly` for an icon-only button, or `slotStart` / `slotEnd` for custom content. `block` makes it take the full width.',
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The text label of the button. Markdown is supported.",
    },
    variant: {
      control: "select",
      options: ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink"],
      description: "The color variant of the button.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "The size of the button.",
    },
    shape: {
      control: "inline-radio",
      options: ["square", "pill", "outline"],
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
  args: { ...defaultArgs },
};

export const Pill: StoryObj<ButtonProps> = {
  args: {
    ...defaultArgs,
    shape: "pill",
  },
};

export const WithIconStart: StoryObj<ButtonProps> = {
  args: {
    ...defaultArgs,
    iconStart: "ambulance",
  },
};

export const WithIconOnly: StoryObj<ButtonProps> = {
  args: {
    ...defaultArgs,
    iconOnly: "git-pull-request-arrow",
  },
};

export const Loading: StoryObj<ButtonProps> = {
  args: {
    ...defaultArgs,
    loading: true,
  },
};
