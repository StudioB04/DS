import type { SVGProps } from "react";
import iconNodes from "lucide-static/icon-nodes.json";

export type LucideIconName = keyof typeof iconNodes;
export const LucideIconMap = Object.keys(iconNodes) as LucideIconName[];

export interface IconProps extends SVGProps<SVGSVGElement> {
  src: string;
  fat?: boolean;
  size?: 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;
}
