import type { StoryObj } from "@storybook/react-vite";
import Loader from "./Loader";
import type { LoaderProps } from "./Loader.types";

export default {
  title: "Components/uikit/Loader",
  component: Loader,
  parameters: {
    docs: {
      description: {
        component:
          "Displays an animated loading indicator, with an optional `label` next to it. It inherits the current text color and scales with the font size.",
      },
    },
  },
};

export const Default: StoryObj<LoaderProps> = {
  args: { label: "" },
};

export const WithLabel: StoryObj<LoaderProps> = {
  args: { label: "Loading..." },
};
