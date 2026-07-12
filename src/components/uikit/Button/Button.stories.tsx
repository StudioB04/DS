import type { StoryObj } from "@storybook/react-vite";
import type { ButtonProps } from "./Button.types";
import Button from "./Button";

export default {
  title: "Components/uikit/Button",
  component: Button,
  argTypes: {
    label: {
      control: "text",
      description: "string or Mardown syntax",
    },
  },
};

export const Default: StoryObj<ButtonProps> = {
  args: { label: "click **me** !" },
};
