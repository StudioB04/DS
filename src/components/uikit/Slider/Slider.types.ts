import type { HTMLAttributes, ReactNode } from "react";

export interface SliderProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "aria-label"> {
  "aria-label": string;
  items: ReactNode[];
  arrows?: boolean;
  dots?: boolean;
  autoPlay?: number;
  slidePerPage?: boolean;
  loop?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  playLabel?: string;
  pauseLabel?: string;
  dotLabel?: string;
  slideLabel?: string;
}
