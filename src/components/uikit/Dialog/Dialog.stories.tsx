import { useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import type { DialogProps } from "./Dialog.types";
import Dialog from "./Dialog";
import Button from "$uikit/Button/Button";

const defaultArgs: DialogProps = {
  title: "Dialog title",
  description: "",
  footer: null,
  persistent: false,
  size: "md",
  position: "center",
  closeLabel: "Close",
  children: (
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos exercitationem sit eius rem dolore modi nemo.
      Consectetur, eum tenetur obcaecati non sunt enim dolore culpa accusamus tempore mollitia quia iste itaque earum ut
      voluptatum nisi fugiat in iure animi.
    </p>
  ),
};

function DialogDemo(props: DialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button label="Open dialog" onClick={() => setOpen(true)} />
      <Dialog
        {...props}
        open={open}
        footer={
          props.footer ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" label="Cancel" variant="neutral" onClick={() => setOpen(false)} />
              <Button size="sm" label="Continue" variant="brand" onClick={() => setOpen(false)} />
            </div>
          ) : null
        }
      />
    </>
  );
}

export default {
  title: "Components/uikit/Dialog",
  component: Dialog,
  render: (args: DialogProps) => <DialogDemo {...args} />,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A modal window displayed above the page. Built on the native `<dialog>` element opened with `showModal()`: the browser makes the rest of the page inert, traps the focus inside the dialog, handles `Escape`, renders the `::backdrop` and gives the focus back to the element that opened it.\n\nThe dialog is opened and closed either with the `open` prop (keep it in sync with `onClose`, which is also called when the user closes the dialog with `Escape`, the close button or the backdrop) or imperatively with a `ref` exposing `open()` and `close()`. A `persistent` dialog has no close button and cannot be dismissed with `Escape` or a click on the backdrop. The `position` prop turns the modal into a side panel (`start`, `end`) or a bottom sheet (`bottom`). Give the dialog an accessible name with `title`, or with `aria-label` when there is no title.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "The heading of the dialog. It is also the accessible name of the dialog.",
    },
    description: {
      control: "text",
      description: "A text displayed under the title, referenced as the accessible description. Markdown is supported.",
    },
    children: {
      control: false,
      description: "The content of the dialog.",
    },
    footer: {
      control: "boolean",
      description:
        "Custom content (ReactNode) displayed in a footer. In this documentation, any truthy value shows a Close button.",
    },
    open: {
      control: false,
      description: "Whether the dialog is open. Keep it in sync with `onClose`.",
    },
    persistent: {
      control: "boolean",
      description: "Removes the close button and prevents closing with `Escape` or a click on the backdrop.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "full"],
      description:
        "The width of the dialog: `sm`, `md` or `lg`, or `full` to take all the available width of the screen. The `lg` size also uses larger paddings.",
    },
    position: {
      control: "inline-radio",
      options: ["center", "start", "end", "bottom"],
      description: "Where the dialog is displayed: centered, or as a panel on the start, end or bottom of the screen.",
    },
    closeLabel: {
      control: "text",
      description: "The accessible name of the close button.",
    },
    onOpen: {
      control: false,
      description: "Called when the dialog is opened.",
    },
    onClose: {
      control: false,
      description: "Called when the dialog is closed, whatever the way it was closed.",
    },
    ref: {
      control: false,
      description: "A handle exposing `open()` and `close()`.",
    },
  },
};

export const Default: StoryObj<DialogProps> = {
  args: { ...defaultArgs },
};

export const WithDescription: StoryObj<DialogProps> = {
  args: {
    ...defaultArgs,
    description: "A short text explaining what this **dialog** is about.",
  },
};

export const WithFooter: StoryObj<DialogProps> = {
  args: {
    ...defaultArgs,
    description: "A short text explaining what this **dialog** is about.",
    footer: true,
  },
};

export const Persistent: StoryObj<DialogProps> = {
  args: {
    ...defaultArgs,
    persistent: true,
    footer: true,
  },
};

export const PositionStart: StoryObj<DialogProps> = {
  args: { ...defaultArgs, position: "start", footer: true },
};

export const PositionEnd: StoryObj<DialogProps> = {
  args: { ...defaultArgs, position: "end", footer: true },
};

export const PositionBottom: StoryObj<DialogProps> = {
  args: { ...defaultArgs, position: "bottom", footer: true },
};

export const SizeSmall: StoryObj<DialogProps> = {
  args: { ...defaultArgs, size: "sm", footer: true },
};

export const SizeLarge: StoryObj<DialogProps> = {
  args: { ...defaultArgs, size: "lg", footer: true },
};

export const SizeFull: StoryObj<DialogProps> = {
  args: { ...defaultArgs, size: "full", footer: true },
};

export const ScrollableContent: StoryObj<DialogProps> = {
  args: {
    ...defaultArgs,
    footer: true,
    children: Array.from({ length: 12 }, () => defaultArgs.children),
  },
};
