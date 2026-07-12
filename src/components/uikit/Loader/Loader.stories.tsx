import type { StoryObj } from "@storybook/react-vite";
import Loader from "./Loader";
import type { LoaderProps } from "./Loader.types";

export default {
  title: "Components/uikit/Loader",
  component: Loader,
};

export const Default: StoryObj<LoaderProps> = {
  args: { label: "" },
};

export const WithLabel: StoryObj<LoaderProps> = {
  args: { label: "Loading..." },
};
