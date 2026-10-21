import type { DialogHTMLAttributes, ReactNode, Ref } from "react";
import type { Size } from "$/types";

export interface DialogHandle {
  open: () => void;
  close: () => void;
}

export interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  title: string;
  description?: string;
  headerSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  persistent?: boolean;
  size?: Size | "full";
  position?: "center" | "start" | "end" | "bottom";
  closeLabel?: string;
  onOpen?: () => void;
  onClose?: () => void;
  ref?: Ref<DialogHandle>;
}
