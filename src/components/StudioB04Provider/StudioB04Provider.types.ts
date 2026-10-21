import type { ReactNode } from "react";
import type { DialogProps } from "$uikit/types";

export interface StudioB04ProviderProps {
  children: ReactNode;
}

export type DialogOptions = Omit<DialogProps, "open" | "ref">;

export interface StudioB04ContextValue {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}
