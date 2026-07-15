import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export type Size = "sm" | "md" | "lg";

export type ButtonColorVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "inverse";

export type BadgeColorVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "inverse"
  | "purple"
  | "yellow"
  | "pink";
