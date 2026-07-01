import type { StoryObj } from "@storybook/react-vite";
import Icon from "./Icon";
import { LucideIconMap, type IconProps } from "./Icon.types";

import { Album } from "lucide-static";

export default {
  title: "Components/uikit/Icon",
  component: Icon,
  argTypes: {
    src: {
      control: "select",
      options: LucideIconMap,
    },
  },
};

export const Default: StoryObj<IconProps> = {
  args: { src: "smile", size: 48, fat: false },
};

export const CustomFromPath: StoryObj<IconProps> = {
  args: { src: "lucide-static/icons/beer.svg", size: 48, fat: false },
  argTypes: {
    src: {
      control: "text",
    },
  },
};

export const CustomFromSvgInline: StoryObj<IconProps> = {
  args: { src: Album, size: 48, fat: false },
};
