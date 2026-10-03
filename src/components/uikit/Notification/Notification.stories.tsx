import type { StoryObj } from "@storybook/react-vite";
import type { NotificationProps } from "./Notification.types";
import Notification from "./Notification";

export default {
  title: "Components/uikit/Notification",
  component: Notification,
  parameters: {
    docs: {
      description: {
        component:
          "A compact counter, typically placed next to a text or an icon to show unread items or pending events. Above `max` (99 by default), it shows `max+`. The `sm` size shows a dot without the number. The default variant is `red`.",
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description: "The text label of the Notification.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "The size of the Notification.",
    },
    variant: {
      control: "select",
      options: ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink"],
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
    variant: "brand",
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
    variant: "brand",
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
    variant: "brand",
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
