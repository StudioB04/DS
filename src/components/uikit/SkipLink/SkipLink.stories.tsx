import type { Decorator, StoryObj } from "@storybook/react-vite";
import type { SkipLinkProps } from "./SkipLink.types";
import SkipLink from "./SkipLink";

const withKeyboardHint: Decorator = (Story) => (
  <div>
    <Story />
    <p>
      The skip link is hidden until it gets the focus: click in this area, then press <kbd>Tab</kbd> to reveal it in the
      top-left corner.
    </p>
  </div>
);

export default {
  title: "Components/uikit/SkipLink",
  component: SkipLink,
  decorators: [withKeyboardHint],
  parameters: {
    docs: {
      description: {
        component:
          'An accessibility link that lets keyboard and screen reader users jump straight to a part of the page (usually the main content), skipping the navigation. It is visually hidden until it receives focus, then appears in the top-left corner of the viewport.\n\nPlace it as the first element of the page, and point `anchor` to the `id` of the target (`#content` → `<main id="content">`). Press `Tab` in a story to reveal it.',
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The text of the link.",
    },
    anchor: {
      control: "text",
      description: "The target of the link: `#` followed by the `id` of the element to jump to.",
    },
  },
};

export const Default: StoryObj<SkipLinkProps> = {
  args: {
    label: "Skip to main content",
    anchor: "#content",
  },
};