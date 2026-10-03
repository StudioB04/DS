import type { StoryObj } from "@storybook/react-vite";
import Icon from "./Icon";
import { LucideIconMap, type IconProps } from "./Icon.types";

import { Album } from "lucide-static";

export default {
  title: "Components/uikit/Icon",
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'Renders an SVG icon with a consistent size and a stroke width adapted to that size (`fat` makes it thicker). The icon is decorative (`aria-hidden="true"`) and uses the current text color.\n\n`src` accepts three kinds of sources: a [Lucide](https://lucide.dev/icons) icon name (rendered from the bundled sprite), a sprite URL with a fragment (`/sprite.svg#id`), or a raw `<svg>` string.',
      },
    },
  },
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
