import type { HTMLAttributes } from "react";

export interface FakeComponentProps extends HTMLAttributes<HTMLSpanElement> {
  test: number;
}
