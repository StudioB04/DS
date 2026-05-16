import { useEffect } from "react";
import type { ReactRenderer } from "@storybook/react";
import type { DecoratorFunction } from "storybook/internal/csf";

export const ThemeDecorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "light";

  useEffect(() => {
    document.documentElement.dataset.dsTheme = theme;
  }, [theme]);

  return <Story />;
};
