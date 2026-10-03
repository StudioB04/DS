import type { StoryObj } from "@storybook/react-vite";

import FocusTrap from "./FocusTrap";
import type { FocusTrapProps } from "./FocusTrap.types";
import { Button } from "$uikit";

const defaultArgs: FocusTrapProps = {
  children: (
    <div style={{ padding: 16, border: "1px solid currentColor" }}>
      <p>When the focus enter the focus trap, it is impossible to focus on an element outside</p>
      <div style={{ display: "flex", gap: 16, marginBlock: 16 }}>
        <Button variant="neutral" label="Inside focustrap" />
        <Button variant="neutral" label="Inside focustrap" />
      </div>
    </div>
  ),
};

export default {
  title: "Components/uikit/FocusTrap",
  component: FocusTrap,
  parameters: {
    docs: {
      description: {
        component:
          "Keeps keyboard focus inside its children: tabbing past the last focusable element brings focus back to the first one, and vice versa. On mount, focus moves to the first focusable element. Useful for modals, popups and other overlays.",
      },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
        <Button variant="neutral" label="Outside focustrap" />
        <Story />
        <Button variant="neutral" label="Outside focustrap" />
      </div>
    ),
  ],
};

export const Default: StoryObj<FocusTrapProps> = {
  args: { ...defaultArgs },
};
