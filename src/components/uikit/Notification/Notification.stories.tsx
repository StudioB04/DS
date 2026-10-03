import type { StoryObj } from "@storybook/react-vite";
import type { NotificationProps } from "./Notification.types";
import Notification from "./Notification";

const defaultArgs: NotificationProps = {
  value: 0,
  size: "md",
  variant: "red",
  max: 99,
};

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
    ...defaultArgs,
    value: 3,
    variant: "brand",
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
    ...defaultArgs,
    value: 223976,
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
    ...defaultArgs,
    value: 12,
    size: "sm",
    variant: "brand",
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
