import type { StoryObj } from "@storybook/react-vite";
import FakeComponent from "./FakeComponent";
import type { FakeComponentProps } from "./FakeComponent.types";

export default {
  title: "Components/uikit/FakeComponent",
  component: FakeComponent,
};

export const Default: StoryObj<FakeComponentProps> = {
  args: { test: 3 },
};
