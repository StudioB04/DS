import type { StoryObj } from "@storybook/react-vite";
import type { StudioB04ProviderProps } from "./StudioB04Provider.types";
import StudioB04Provider from "./StudioB04Provider";
import useDialog from "./useDialog";
import Button from "$uikit/Button/Button";

const defaultArgs: StudioB04ProviderProps = {
  children: null,
};

function OpenDialogDemo() {
  const { showDialog, hideDialog } = useDialog();

  return (
    <Button
      label="Open dialog"
      onClick={() =>
        showDialog({
          title: "Dialog title",
          description: "Opened with **showDialog**, without any state in the page.",
          children: <p>Only one dialog is mounted at a time, and only while it is displayed.</p>,
          footer: <Button label="Close" variant="neutral" shape="outline" onClick={hideDialog} />,
        })
      }
    />
  );
}

const rows = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  status: index % 3 === 0 ? "Archived" : "Active",
}));

function ManyRowsDemo() {
  const { showDialog, hideDialog } = useDialog();

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.status}</td>
            <td>
              <Button
                label="Details"
                size="sm"
                variant="neutral"
                shape="outline"
                onClick={() =>
                  showDialog({
                    title: row.name,
                    description: `Status: **${row.status}**`,
                    children: <p>The dialog of the row {row.id} is the only one in the DOM.</p>,
                    footer: <Button label="Close" variant="neutral" shape="outline" onClick={hideDialog} />,
                  })
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReplaceDemo() {
  const { showDialog, hideDialog } = useDialog();

  const showSecond = () =>
    showDialog({
      title: "Second dialog",
      size: "sm",
      children: <p>It replaced the first one.</p>,
      footer: <Button label="Close" variant="neutral" shape="outline" onClick={hideDialog} />,
    });

  return (
    <Button
      label="Open first dialog"
      onClick={() =>
        showDialog({
          title: "First dialog",
          children: <p>Showing another dialog replaces this one.</p>,
          footer: <Button label="Show the second one" variant="brand" onClick={showSecond} />,
        })
      }
    />
  );
}

export default {
  title: "Components/uikit/StudioB04Provider",
  component: StudioB04Provider,
  render: (args: StudioB04ProviderProps) => (
    <StudioB04Provider {...args}>
      <OpenDialogDemo />
    </StudioB04Provider>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Wrap your application once with `StudioB04Provider` to use the services of the design system from anywhere in the tree.\n\nFor now it provides `useDialog()`, which returns `showDialog(options)` and `hideDialog()`. `options` are the props of the `Dialog` (`title`, `children`, `footer`, `size`, `position`, `persistent`, `onOpen`, `onClose`…) except `open` and `ref`. The provider renders a single `Dialog` while one is displayed and removes it from the DOM once its closing animation is finished, so a table with 100 buttons does not need 100 dialogs. Showing a dialog while another one is open replaces it.\n\n`useDialog` throws when it is used outside of a `StudioB04Provider`.",
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: "The application (or the part of it) that can use the hooks of the provider.",
    },
  },
};

export const Default: StoryObj<StudioB04ProviderProps> = {
  args: { ...defaultArgs },
};

export const ManyRows: StoryObj<StudioB04ProviderProps> = {
  args: { ...defaultArgs },
  render: (args) => (
    <StudioB04Provider {...args}>
      <ManyRowsDemo />
    </StudioB04Provider>
  ),
};

export const ReplaceCurrentDialog: StoryObj<StudioB04ProviderProps> = {
  args: { ...defaultArgs },
  render: (args) => (
    <StudioB04Provider {...args}>
      <ReplaceDemo />
    </StudioB04Provider>
  ),
};
