"use client";

/* eslint-disable react/no-danger */
import { createElement } from "react";
import clsx from "clsx";
import iconNodes from "lucide-static/icon-nodes.json";
import { LucideIconMap, type IconProps, type LucideIconName } from "./Icon.types";

import "./Icon.css";

export default function Icon({ src, size = 24, fat, className, ...restProps }: IconProps) {
  const SVGProps = {
    className: clsx("ds-icon", `ds-icon--size-${size}`, fat && "ds-icon--fat", className),
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    strokeWidth: (Math.pow(size / (fat ? 8 : 12), 0.9) * 24) / size,
    ...restProps,
  };

  const isLucideIcon = LucideIconMap.includes(src as LucideIconName);

  if (isLucideIcon) {
    const nodes = iconNodes[src as LucideIconName] as [tag: string, attributes: Record<string, string>][];

    return (
      <svg {...SVGProps} aria-hidden="true" className={clsx(SVGProps.className, `ds-icon--${src}`)}>
        {nodes.map(([tag, attributes], index) => createElement(tag, { key: index, ...attributes }))}
      </svg>
    );
  }

  if (!src.includes("<svg")) {
    return (
      <svg {...SVGProps} aria-hidden="true" className={clsx(SVGProps.className, "ds-icon--custom")}>
        <use href={src} />
      </svg>
    );
  }

  const SVGString = decodeURI(src);
  const SVGMatch = /<svg([^>]*)>([\s\S]*?)<\/svg>/.exec(SVGString);

  if (!SVGMatch) return null;

  const [, , innerSVG] = SVGMatch;

  return (
    <svg {...SVGProps} aria-hidden="true" className={clsx(SVGProps.className, "ds-icon--inline")}>
      <g dangerouslySetInnerHTML={{ __html: innerSVG }} />
    </svg>
  );
}
