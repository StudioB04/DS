import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export enum Size {
  sm = "sm",
  md = "md",
  lg = "lg",
}

export enum ButtonColorVariant {
  primary = "primary",
  secondary = "secondary",
  tertiary = "tertiary",
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
  inverse = "inverse",
}
