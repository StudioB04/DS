import type { StoryObj } from "@storybook/react-vite";

import FocusTrap from "./FocusTrap";
import type { FocusTrapProps } from "./FocusTrap.types";
import { Button } from "$uikit";

export default {
  title: "Components/uikit/FocusTrap",
  component: FocusTrap,
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
  args: {
    children: (
      <div style={{ padding: 16, border: "1px solid currentColor" }}>
        <p>When the focus enter the focus trap, it is impossible to focus on an element outside</p>
        <div style={{ display: "flex", gap: 16, marginBlock: 16 }}>
          <Button variant="neutral" label="Inside focustrap" />
          <Button variant="neutral" label="Inside focustrap" />
        </div>
      </div>
    ),
  },
};
