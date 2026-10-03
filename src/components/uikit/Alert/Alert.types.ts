import type { Variant } from "$/types";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  children?: ReactNode;
  variant?: Variant;
  persistant?: boolean;
  titleSlotStart?: ReactNode;
  titleSlotEnd?: ReactNode;
  closeLabel?: string;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}
