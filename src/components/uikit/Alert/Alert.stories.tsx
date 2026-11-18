import type { StoryObj } from "@storybook/react-vite";
import type { AlertProps } from "./Alert.types";
import Alert from "./Alert";
import Badge from "$uikit/Badge/Badge";
import Icon from "$uikit/Icon/Icon";

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.";

const defaultArgs: AlertProps = {
  title: "Changes **saved**",
  variant: "neutral",
  persistant: false,
  closeLabel: "Close",
  children: content,
};

export default {
  title: "Components/uikit/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Displays a message with a required `title` (markdown: `strong`, `em`, `br`) and optional content (`children`). It has `role="alert"`, so screen readers announce it when it appears.\n\nThe close button removes the alert from the DOM, then calls `onClose`; set `closeLabel` to translate its accessible label. With `persistant`, there is no close button. `titleSlotStart` and `titleSlotEnd` place custom content (icon, badge…) before and right after the title.',
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "The title of the Alert (required). Markdown is supported.",
    },
    variant: {
      control: "select",
      options: ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink", "inverse"],
      description: "The color variant of the Alert.",
    },
    persistant: {
      control: "boolean",
      description: "Hides the close button: the Alert can't be dismissed.",
    },
    closeLabel: {
      control: "text",
      description: "Accessible label of the close button.",
    },
    titleSlotStart: {
      control: false,
      description: "Custom content (ReactNode) displayed before the title.",
    },
    titleSlotEnd: {
      control: false,
      description: "Custom content (ReactNode) displayed right after the title.",
    },
  },
};

export const Default: StoryObj<AlertProps> = {
  args: { ...defaultArgs },
};

export const WithTitleSlotStart: StoryObj<AlertProps> = {
  args: {
    ...defaultArgs,
    title: "Payment accepted",
    variant: "green",
    titleSlotStart: <Icon src="circle-check" size={20} />,
  },
};

export const WithTitleSlotEnd: StoryObj<AlertProps> = {
  args: {
    ...defaultArgs,
    title: "New features",
    variant: "brand",
    titleSlotStart: <Icon src="sparkles" size={20} />,
    titleSlotEnd: <Badge label="v0.2" variant="brand" type="plain" size="sm" />,
  },
};

export const Persistant: StoryObj<AlertProps> = {
  args: {
    ...defaultArgs,
    title: "Maintenance scheduled on Sunday",
    variant: "orange",
    persistant: true,
    titleSlotStart: <Icon src="triangle-alert" size={20} />,
  },
};

export const TitleOnly: StoryObj<AlertProps> = {
  args: {
    ...defaultArgs,
    title: "New version available",
    variant: "blue",
    children: undefined,
  },
};
