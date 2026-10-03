import type { StoryObj } from "@storybook/react-vite";
import type { SkeletonProps } from "./Skeleton.types";
import Skeleton from "./Skeleton";

export default {
  title: "Components/uikit/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'A placeholder displayed while content is loading, with a reflection sweeping from left to right (disabled when reduced motion is preferred). It is hidden from assistive technologies (`aria-hidden="true"`): announce the loading state elsewhere, e.g. with `aria-busy` on the container.\n\n`type` sets the shape: `block` (full width, rounded corners), `round` (a circle as wide as it is high) or `text` (full-width lines, the last one shorter; the height is rounded down to a whole number of lines). Set `height` in `px` or `rem`.',
      },
    },
  },
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
