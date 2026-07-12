import type { HTMLAttributes } from "react";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
  allowHtml?: boolean;
  allowTags?: string[];
  className?: string;
}
