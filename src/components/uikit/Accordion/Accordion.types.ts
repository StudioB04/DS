import type { Size } from "$/types";
import type { DetailsHTMLAttributes, ReactNode } from "react";

export interface AccordionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  label: string; //Markdown is supported (`strong`, `em`, `br`)
  name?: string;
  children: ReactNode;
  size?: Size;
  slotStart?: ReactNode;
  slotEnd?: ReactNode;
}
