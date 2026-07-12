import type { StoryObj } from "@storybook/react-vite";
import type { LinkProps } from "./Link.types";
import Link from "./Link";
import { LucideIconMap } from "$uikit/types";

export default {
  title: "Components/uikit/Link",
  component: Link,
  argTypes: {
    label: {
      control: "text",
      description: "The text label of the Link. Markdown is supported.",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "success", "error", "warning", "info", "inverse"],
      description: "The color variant of the Link.",
    },
    href: {
      control: "text",
      description: "If provided, the Link will render as an anchor tag (`<a>`) instead of a Link (`<Link>`).",
    },
    external: {
      control: "boolean",
      description: "If true, the anchor tag will open in a new tab.",
    },
    disabled: {
      control: "boolean",
      description: "If true, the link will be disabled.",
    },
    iconStart: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display at the start of the Link.",
    },
    iconEnd: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display at the end of the Link.",
    },
  },
};

export const Default: StoryObj<LinkProps> = {
  args: {
    label: "click **me** !",
    variant: "primary",
    href: "#",
    external: false,
    disabled: false,
  },
};
