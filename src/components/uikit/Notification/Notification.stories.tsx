import type { StoryObj } from "@storybook/react-vite";
import type { NotificationProps } from "./Notification.types";
import Notification from "./Notification";

export default {
  title: "Components/uikit/Notification",
  component: Notification,
  argTypes: {
    value: {
      control: "text",
      description: "The text label of the Notification.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "The size of the Notification.",
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
      description: "The color variant of the Notification.",
    },
    max: {
      control: "number",
      description: "Limit the maximum value displayed in the Notification.",
    },
  },
};

export const Default: StoryObj<NotificationProps> = {
  args: {
    value: 3,
    size: "md",
    variant: "primary",
    max: 99,
  },
  decorators: [
    (Story) => (
      <p>
        Lorem ipsum
        <Story />
      </p>
    ),
  ],
};

export const NoLimit: StoryObj<NotificationProps> = {
  args: {
    value: 223976,
    size: "md",
    variant: "primary",
    max: 999999999999,
  },
  decorators: [
    (Story) => (
      <p>
        Lorem ipsum
        <Story />
      </p>
    ),
  ],
};

export const Small: StoryObj<NotificationProps> = {
  args: {
    value: 12,
    size: "sm",
    variant: "primary",
    max: 99,
  },
  decorators: [
    (Story) => (
      <p>
        Lorem ipsum
        <Story />
      </p>
    ),
  ],
};
