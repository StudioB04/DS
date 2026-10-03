import type { StoryObj } from "@storybook/react-vite";
import type { SkeletonProps } from "./Skeleton.types";
import Skeleton from "./Skeleton";

export default {
  title: "Components/uikit/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  argTypes: {
    height: {
      control: "text",
      description: "Height of the placeholder, in `px` or `rem` (e.g. `48px`, `3rem`).",
    },
    type: {
      control: "inline-radio",
      options: ["block", "round", "text"],
      description: "`block`: rounded square · `round`: circle · `text`: lines, the last one shorter.",
    },
  },
};

export const Default: StoryObj<SkeletonProps> = {
  args: {
    height: "4rem",
    type: "block",
  },
};

export const Round: StoryObj<SkeletonProps> = {
  args: {
    height: "4rem",
    type: "round",
  },
};

export const Text: StoryObj<SkeletonProps> = {
  args: {
    height: "100px",
    type: "text",
  },
};