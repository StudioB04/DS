import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export type Size = "sm" | "md" | "lg";

export type Variant =
  | "neutral"
  | "brand"
  | "alt"
  | "green"
  | "success"
  | "red"
  | "error"
  | "orange"
  | "warning"
  | "blue"
  | "info"
  | "purple"
  | "inverse";
