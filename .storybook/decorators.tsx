import { useEffect } from "react";
import type { ReactRenderer } from "@storybook/react";
import type { DecoratorFunction } from "storybook/internal/csf";

export const ThemeDecorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = context.globals.theme || "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-ds-theme", theme);
  }, [theme]);

  return <Story />;
};
