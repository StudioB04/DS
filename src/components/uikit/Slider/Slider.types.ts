import type { HTMLAttributes, ReactNode } from "react";

export interface SliderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
}
