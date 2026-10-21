import { useEffect } from "react";
import StudioB04Provider from "$/components/StudioB04Provider/StudioB04Provider";
import type { ReactRenderer } from "@storybook/react";
import type { DecoratorFunction } from "storybook/internal/csf";

export const ThemeDecorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "light";

  useEffect(() => {
    document.documentElement.dataset.dsTheme = theme;
  }, [theme]);

  return <Story />;
};

export const ProviderDecorator: DecoratorFunction<ReactRenderer> = (Story) => (
  <StudioB04Provider>
    <Story />
  </StudioB04Provider>
);
