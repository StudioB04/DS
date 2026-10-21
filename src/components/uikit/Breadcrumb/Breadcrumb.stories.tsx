import type { Decorator, StoryObj } from "@storybook/react-vite";
import type { BreadcrumbProps } from "./Breadcrumb.types";
import Breadcrumb from "./Breadcrumb";
import Icon from "$uikit/Icon/Icon";
import { LucideIconMap } from "$uikit/Icon/Icon.types";

const defaultArgs: BreadcrumbProps = {
  items: [
    { label: "Home", href: "#" },
    { label: "Settings", href: "#" },
    { label: "Account", href: "#" },
    { label: "Members", href: "#" },
    { label: "Roles", href: "#" },
  ],
  currentPageLabel: "Team",
  homeAsIcon: false,
  divider: "chevron-right",
};

const decorators: Decorator[] = [
  (Story) => (
    <div
      style={{
        inlineSize: "20rem",
        maxInlineSize: "100%",
        overflow: "auto",
        resize: "horizontal",
        padding: 8,
        border: "1px solid var(--ds-border-secondary)",
        borderRadius: 8,
      }}
    >
      <Story />
    </div>
  ),
];

export default {
  title: "Components/uikit/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Shows the location of the current page within the site hierarchy. Rendered as a `<nav>` landmark containing an ordered list, the last entry being the current page (`aria-current="page"`), displayed as plain text from `currentPageLabel`.\n\nEach item can display a `slotStart` before its label, and `homeAsIcon` replaces the first item with a house icon while keeping its label as the accessible name. When the trail does not fit in the width of its container, the middle items are collapsed behind an ellipsis (the first item and the current page always stay visible); the number of visible items follows the container size. The ellipsis is a link to the last hidden page (the closest hidden item that has a `href`) and is named after the `label` of that item. Items without a `href` are rendered as plain text.',
      },
    },
  },
  decorators,
  argTypes: {
    items: {
      control: "object",
      description:
        "The parent pages, from the root to the page before the current one. Each item has a `label`, an optional `href`, an optional `slotStart` (ReactNode displayed before the label).",
    },
    currentPageLabel: {
      control: "text",
      description: "The label of the current page, displayed as plain text after the items.",
    },
    homeAsIcon: {
      control: "boolean",
      description: "Replaces the first item with a house icon. Its label stays available to assistive technologies.",
    },
    divider: {
      control: "select",
      options: LucideIconMap,
      description: "The name of the icon to display as divider.",
    },
    "aria-label": {
      control: "text",
      description: "The accessible name of the navigation landmark.",
    },
  },
};

export const Default: StoryObj<BreadcrumbProps> = {
  args: { ...defaultArgs },
};

export const HomeAsIcon: StoryObj<BreadcrumbProps> = {
  args: {
    ...defaultArgs,
    homeAsIcon: true,
  },
};

export const CustomDivider: StoryObj<BreadcrumbProps> = {
  args: { ...defaultArgs, divider: "arrow-right" },
};

export const WithSlotStart: StoryObj<BreadcrumbProps> = {
  args: {
    ...defaultArgs,
    items: defaultArgs.items.map((item) => ({ ...item, slotStart: <Icon src="earth" size={20} /> })),
  },
};

export const WithoutLinks: StoryObj<BreadcrumbProps> = {
  args: {
    ...defaultArgs,
    items: [{ label: "Home", href: "#" }, { label: "Settings" }],
  },
};
