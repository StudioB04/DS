import type { Variant } from "$/types";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title of the alert, always displayed. Markdown is supported (`strong`, `em`, `br`). */
  title: string;
  /** Content displayed under the title. */
  children?: ReactNode;
  variant?: Variant;
  /** Hides the close button: the alert can't be dismissed. */
  persistant?: boolean;
  /** Custom content displayed before the title (icon, badge…). */
  titleSlotStart?: ReactNode;
  /** Custom content displayed right after the title (badge, counter…). */
  titleSlotEnd?: ReactNode;
  /** Accessible label of the close button. */
  closeLabel?: string;
  /** Called when the close button is clicked, before the alert is hidden. */
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}
