import { useId } from "react";
import type { StoryObj } from "@storybook/react-vite";
import type { DialogProps } from "./Dialog.types";
import Dialog from "./Dialog";
import Button from "$uikit/Button/Button";
import useDialog from "$/components/StudioB04Provider/useDialog";

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
  const id = useId();

  return (
    <>
      <Button label="Open dialog" popoverTarget={id} />
      <Dialog
        {...props}
        id={id}
        footer={
          props.footer ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" label="Cancel" variant="neutral" popoverTarget={id} popoverTargetAction="hide" />
              <Button size="sm" label="Continue" variant="brand" popoverTarget={id} popoverTargetAction="hide" />
            </div>
          ) : null
        }
      />
    </>
  );
}

function ShowDialogDemo(props: DialogProps) {
  const { showDialog, hideDialog } = useDialog();

  return (
    <Button
      label="Show dialog"
      onClick={() =>
        showDialog({
          ...props,
          footer: <Button size="sm" label="Close" variant="neutral" onClick={hideDialog} />,
        })
      }
    />
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
          'A modal window displayed above the page. Built on the native `<dialog>` element and the Popover API: the browser keeps the open state, so there is no `open` prop and nothing to synchronise in your components.\n\nGive the dialog an `id` and open it with any button (or other invoker) that targets it: `<Button popoverTarget="my-dialog" />`. Use `popoverTargetAction="hide"` on a button inside the dialog to close it, or call `open()` and `close()` on a `ref`. The dialog can also be created on the fly with `showDialog()` and `hideDialog()` (see _Showing a dialog from code_ below).\n\n`Escape` and a click outside close the dialog, unless it is `persistent`: a persistent dialog has no close button and can only be closed with the `ref`, `hideDialog()` or a `popoverTargetAction="hide"` button. The focus is moved inside the dialog and trapped there, then given back to the element that opened it. The `position` prop turns the modal into a side panel (`start`, `end`) or a bottom sheet (`bottom`).\n\n## Showing a dialog from code\n\nWhen the content of the dialog depends on the code that opens it (a confirmation, the details of a table row...), you do not have to render a `Dialog` yourself. `useDialog()` returns two functions:\n\n- `showDialog(props)` creates a dialog on the fly and opens it. `props` are the props of the `Dialog` (`title` and `children` are required), except `ref`. It returns nothing.\n- `hideDialog()` closes the dialog that is currently displayed. It does nothing when there is none.\n\nThe dialog is rendered by `StudioB04Provider`, so the provider must wrap your application once (it is already added in Storybook and in the sandbox). Only one dialog exists at a time: it is mounted when `showDialog()` is called and removed from the DOM once its closing animation is finished, so a table with 100 rows does not need 100 dialogs. Calling `showDialog()` while a dialog is already open replaces it. When the dialog closes, the focus goes back to the element that opened the first one.\n\n```tsx\nimport { useDialog } from "@studio_b04/ds";\nimport { Button } from "@studio_b04/ds/uikit";\n\nexport default function DeleteButton({ item }) {\n  const { showDialog, hideDialog } = useDialog();\n\n  return (\n    <Button\n      label="Delete"\n      onClick={() =>\n        showDialog({\n          title: `Delete ${item.name}?`,\n          description: "This **cannot** be undone.",\n          children: <p>The item will be removed from your account.</p>,\n          footer: <Button label="Cancel" variant="neutral" onClick={hideDialog} />,\n          onClose: () => console.log("closed"),\n        })\n      }\n    />\n  );\n}\n```\n\nThe content is read when `showDialog()` is called: if it must react to some state, make it a component that holds its own state. `useDialog()` throws an error when it is used outside of a `StudioB04Provider`.',
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
        "Custom content (ReactNode) displayed in a footer. In this documentation, any truthy value shows Cancel and Continue buttons.",
    },
    id: {
      control: false,
      description: "The id of the dialog. Buttons target it with `popoverTarget` to open or close it.",
    },
    headerSlot: {
      control: false,
      description: "Custom content (ReactNode) displayed above the header, such as an image or an icon.",
    },
    persistent: {
      control: "boolean",
      description:
        'Removes the close button and prevents closing with `Escape` or a click outside. It is then a `manual` popover, closed with the `ref`, `hideDialog()` or a `popoverTargetAction="hide"` button.',
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
      description: "Called when the dialog is opened, whatever the way it was opened.",
    },
    onClose: {
      control: false,
      description: "Called with the toggle event when the dialog is closed, whatever the way it was closed.",
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

export const ShowDialog: StoryObj<DialogProps> = {
  args: { ...defaultArgs, description: "Created on the fly with **showDialog**, closed with **hideDialog**." },
  render: (args) => <ShowDialogDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The dialog is not rendered in the page: the button calls `showDialog(props)` and the footer button calls `hideDialog()`. The controls change the props passed to `showDialog()`.",
      },
    },
  },
};
