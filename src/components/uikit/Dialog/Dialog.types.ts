import type { DialogHTMLAttributes, ReactNode, Ref } from "react";
import type { Size } from "$/types";

export interface DialogHandle {
  open: () => void;
  close: () => void;
}

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "popover" | "onClose"> {
  title: string;
  description?: string;
  headerSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  persistent?: boolean;
  size?: Size | "full";
  position?: "center" | "start" | "end" | "bottom";
  closeLabel?: string;
  onOpen?: () => void;
  onClose?: (event: ToggleEvent) => void;
  ref?: Ref<DialogHandle>;
}
