import type { StoryObj } from "@storybook/react-vite";
import type { AccordionProps } from "./Accordion.types";
import Accordion from "./Accordion";
import Badge from "$uikit/Badge/Badge";
import Icon from "$uikit/Icon/Icon";
import Notification from "$uikit/Notification/Notification";

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.";

export default {
  title: "Components/uikit/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
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
  args: {
    label: "What is **StudioB04**?",
    size: "md",
    open: false,
    children: content,
  },
};

export const Open: StoryObj<AccordionProps> = {
  args: {
    label: "Opened by default",
    size: "md",
    open: true,
    children: content,
  },
};

export const WithSlotStart: StoryObj<AccordionProps> = {
  args: {
    label: "Need help?",
    size: "md",
    slotStart: <Icon src="circle-question-mark" size={20} />,
    children: content,
  },
};

export const WithBadgeSlot: StoryObj<AccordionProps> = {
  args: {
    label: "Release notes",
    size: "md",
    slotStart: <Badge label="New" variant="brand" size="sm" />,
    children: content,
  },
};

export const WithSlotEnd: StoryObj<AccordionProps> = {
  args: {
    label: "Notifications",
    size: "md",
    slotEnd: <Notification value={3} variant="brand" />,
    children: content,
  },
};

export const WithBothSlots: StoryObj<AccordionProps> = {
  args: {
    label: "Release notes",
    size: "md",
    slotStart: <Icon src="rocket" size={20} />,
    slotEnd: <Badge label="v0.2" variant="neutral" size="sm" />,
    children: content,
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
  args: {},
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
  args: {
    size: "md",
  },
};
