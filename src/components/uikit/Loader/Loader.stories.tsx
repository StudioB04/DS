import type { StoryObj } from "@storybook/react-vite";
import Loader from "./Loader";
import { LoaderNameMap, type LoaderProps } from "./Loader.types";
import type { FC } from "react";

export default {
  title: "Components/uikit/Loader",
  component: Loader,
  argTypes: {
    name: {
      control: "select",
      options: LoaderNameMap,
    },
  },
  decorators: [
    (Story: FC) => (
      <div style={{ fontSize: "4rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const Default: StoryObj<LoaderProps> = {
  args: { name: "BouncingDots" },
};
