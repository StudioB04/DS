import type { ButtonColorVariants, ButtonOrLinkProps, Size } from "$/types";
import type { ReactNode } from "react";

export interface ButtonProps extends ButtonOrLinkProps {
  label: string;
  size: Size;
  external?: boolean;
  loading?: boolean;
  disabled?: boolean;
  shape?: "pill" | "square";
  block?: boolean;
  variant?: ButtonColorVariants;
  slotStart?: ReactNode;
  slotEnd?: ReactNode;
}
