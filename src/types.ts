import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export type Size = "sm" | "md" | "lg";

export type Variant =
  | "neutral"
  | "inverse"
  | "brand"
  | "alt"
  | "green"
  | "red"
  | "orange"
  | "blue"
  | "purple"
  | "yellow"
  | "pink";
