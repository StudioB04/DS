import type { FC } from "react";
import type { StoryObj } from "@storybook/react-vite";
import type { LogoProps } from "./Logo.types";
import Logo from "./Logo";

export default {
  title: "Components/uikit/Logo",
  component: Logo,
  argTypes: {
    type: {
      control: "radio",
      options: ["small", "full"],
    },
    variant: {
      control: "radio",
      options: ["brand", "alt", "inverse", "default"],
    },
  },
  decorators: [
    (Story: FC) => (
      <div style={{ fontSize: "10rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const Default: StoryObj<LogoProps> = {
  args: { type: "small", variant: "brand" },
};
