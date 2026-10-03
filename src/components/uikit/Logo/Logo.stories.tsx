import type { FC } from "react";
import type { StoryObj } from "@storybook/react-vite";
import type { LogoProps } from "./Logo.types";
import Logo from "./Logo";

export default {
  title: "Components/uikit/Logo",
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          "Renders the StudioB04 logo as an inline SVG. `type` switches between the `small` mark and the `full` logo; `variant` (`brand`, `alt`, `inverse`, `default`) adapts its colors to the surrounding surface.",
      },
    },
  },
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
