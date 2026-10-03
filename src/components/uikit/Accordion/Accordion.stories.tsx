import type { StoryObj } from "@storybook/react-vite";
import type { AccordionProps } from "./Accordion.types";
import Accordion from "./Accordion";
import Badge from "$uikit/Badge/Badge";
import Icon from "$uikit/Icon/Icon";
import Notification from "$uikit/Notification/Notification";

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.";

const defaultArgs: AccordionProps = {
  label: "What is **StudioB04**?",
  name: "",
  open: false,
  size: "md",
  children: content,
};

export default {
  title: "Components/uikit/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Reveals and hides content. Built on the native `<details>` / `<summary>` elements: it works without JavaScript, is keyboard accessible (`Enter` / `Space` on the summary) and is announced correctly by screen readers.\n\nThe summary is laid out as `slotStart` → `label` (markdown: `strong`, `em`, `br`) → `slotEnd` → chevron. The content opens and closes with a height and opacity animation (pure CSS, disabled when reduced motion is preferred). Accordions sharing the same `name` form an exclusive group: only one can be open at a time.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The summary text, always visible. Markdown is supported.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "The size of the Accordion.",
    },
    open: {
      control: "boolean",
      description: "Whether the Accordion is open (native `open` attribute).",
    },
    name: {
      control: "text",
      description: "Native `name` attribute: accordions sharing a name only allow one open at a time.",
    },
    slotStart: {
      control: false,
      description: "Custom content (ReactNode) displayed before the label.",
    },
    slotEnd: {
      control: false,
      description: "Custom content (ReactNode) displayed after the label, before the chevron.",
    },
  },
};

export const Default: StoryObj<AccordionProps> = {
  args: { ...defaultArgs },
};

export const Open: StoryObj<AccordionProps> = {
  args: {
    ...defaultArgs,
    label: "Opened by default",
    open: true,
  },
};

export const WithSlotStart: StoryObj<AccordionProps> = {
  args: {
    ...defaultArgs,
    label: "Need help?",
    slotStart: <Icon src="circle-question-mark" size={20} />,
  },
};

export const WithBadgeSlot: StoryObj<AccordionProps> = {
  args: {
    ...defaultArgs,
    label: "Release notes",
    slotStart: <Badge label="New" variant="brand" size="sm" />,
  },
};

export const WithSlotEnd: StoryObj<AccordionProps> = {
  args: {
    ...defaultArgs,
    label: "Notifications",
    slotEnd: <Notification value={3} variant="brand" />,
  },
};

export const WithBothSlots: StoryObj<AccordionProps> = {
  args: {
    ...defaultArgs,
    label: "Release notes",
    slotStart: <Icon src="rocket" size={20} />,
    slotEnd: <Badge label="v0.2" variant="neutral" size="sm" />,
  },
};

export const Sizes: StoryObj<AccordionProps> = {
  render: (args) => (
    <div>
      <Accordion {...args} label="Small" size="sm">
        {content}
      </Accordion>
      <Accordion {...args} label="Medium" size="md">
        {content}
      </Accordion>
      <Accordion {...args} label="Large" size="lg">
        {content}
      </Accordion>
    </div>
  ),
  args: { ...defaultArgs },
};

export const ExclusiveGroup: StoryObj<AccordionProps> = {
  render: (args) => (
    <div>
      <Accordion {...args} label="First question" name="faq" open>
        {content}
      </Accordion>
      <Accordion {...args} label="Second question" name="faq">
        {content}
      </Accordion>
      <Accordion {...args} label="Third question" name="faq">
        {content}
      </Accordion>
    </div>
  ),
  args: { ...defaultArgs },
};
