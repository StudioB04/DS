import type { Preview } from "@storybook/react-vite";
import { ThemeDecorator } from "./decorators";

import "./storybook.css";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Set color scheme",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      exclude: ["id", "className", "style", "children", "defaultValue", "ref"],
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;
