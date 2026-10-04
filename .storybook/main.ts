import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["./Introduction.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldExtractValuesFromUnion: true,
      shouldSortUnions: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },

  core: {
    disableTelemetry: true,
  },

  features: {
    experimentalReview: true,
    experimentalDocgenServer: true
  }
};

export default config;
