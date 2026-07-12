// https://lucide.dev/guide/static/svg-sprite
/* eslint-disable react/no-danger */
import clsx from "clsx";
import spriteUrl from "lucide-static/sprite.svg?url";
import { LucideIconMap, type IconProps, type LucideIconName } from "./Icon.types";

import "./Icon.css";

export default ({ src, size = 24, fat, className, ...restProps }: IconProps) => {
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
    return (
      <svg {...SVGProps} aria-hidden="true" className={clsx(SVGProps.className, `ds-icon--${src}`)}>
        <use href={`${spriteUrl}#${src}`} />
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
};
