import type { AnchorHTMLAttributes, ReactElement } from "react";
import clsx from "clsx";
import MarkdownComponent from "markdown-to-jsx";
import type { MarkdownProps } from "./Markdown.types";

import "./Markdown.css";

const Markdown = ({
  children,
  allowHtml = false,
  allowTags = ["p", "a", "strong", "em", "h1", "h2", "h3", "h4", "ul", "ol", "li", "hr", "br", "code", "img"],
  className,
  ...restProps
}: MarkdownProps) => {
  const ignoreTag = { component: ({ children }: { children: string }) => children };

  const setOverride = (tag: string, className: string) => {
    if (allowTags.includes(tag)) {
      return { props: { className } };
    }
    return ignoreTag;
  };

  interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
  }

  const CustomLink = ({ href = "", children, ...props }: CustomLinkProps): ReactElement | null => {
    if (!allowTags.includes("a")) {
      return null;
    }

    const isBlank = href.startsWith("!!");

    return (
      <a
        href={isBlank ? href.slice(2) : href}
        target={isBlank ? "_blank" : undefined}
        rel={isBlank ? "noopener noreferrer" : undefined}
        {...props}
        className={clsx("ds-markdown__link", props.className)}
      >
        {children}
      </a>
    );
  };

  /* Two spaces and a new line to generate a <br/> */
  const br = `  
`;

  return (
    <MarkdownComponent
      className={clsx("ds-markdown", className)}
      options={{
        wrapper: "div",
        forceWrapper: true,
        slugify: (str) => `anchor-${str}`,
        disableAutoLink: true,
        disableParsingRawHTML: !allowHtml,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        overrides: {
          a: CustomLink,
          p: setOverride("p", "ds-markdown__p"),
          strong: setOverride("strong", "ds-markdown__strong"),
          em: setOverride("em", "ds-markdown__em"),
          h1: setOverride("h1", "ds-markdown__title ds-markdown__title--h1"),
          h2: setOverride("h2", "ds-markdown__title ds-markdown__title--h2"),
          h3: setOverride("h3", "ds-markdown__title ds-markdown__title--h3"),
          h4: setOverride("h4", "ds-markdown__title ds-markdown__title--h4"),
          ul: setOverride("ul", "ds-markdown__ul"),
          ol: setOverride("ol", "ds-markdown__ol"),
          li: setOverride("li", "ds-markdown__li"),
          hr: setOverride("hr", "ds-markdown__hr"),
          br: setOverride("br", "ds-markdown__br"),
          code: setOverride("code", "ds-markdown__code"),
          img: setOverride("img", "ds-markdown__img"),
          pre: ignoreTag,
        },
      }}
      {...restProps}
    >
      {children?.replace(/(?<!\n)\n(?!\n)/g, br)}
    </MarkdownComponent>
  );
};

export default Markdown;
