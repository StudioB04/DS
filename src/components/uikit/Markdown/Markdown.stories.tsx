import Markdown from "./Markdown";
import type { MarkdownProps } from "./Markdown.types";

const renderMarkdownStory = ({ children, allowHtml }: MarkdownProps) => (
  <Markdown allowHtml={allowHtml}>{children}</Markdown>
);

export default {
  title: "Components/uikit/Markdown",
  component: Markdown,
  argTypes: {
    children: {
      control: "text",
      description:
        "Mardown syntax only, please refer to [this page](https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for help",
    },
  },
};

export const Default = {
  render: renderMarkdownStory,
  args: {
    children: `I am a **mardown** _syntax_ with a [link](/)`,
    allowTags: ["a", "strong", "em"],
    allowHtml: false,
  },
};

export const ExternalLink = {
  render: renderMarkdownStory,
  args: {
    children: "This [link](!!/) will open a new tab",
    allowTags: ["a", "strong", "em"],
    allowHtml: false,
  },
};

export const Complex = {
  render: renderMarkdownStory,
  args: {
    children: `
Title
=====

\n\n
Here is a *complex* **Mardown syntax** with [links](/) and images

![image](https://placehold.co/100)

---

- first choice
- Second choice

---

1. coucou
2. Hello

  `,
    allowTags: ["p", "a", "strong", "em", "h1", "h2", "h3", "h4", "ul", "ol", "li", "hr", "br", "code", "img"],
    allowHtml: false,
  },
};

export const WithHTMLTags = {
  render: renderMarkdownStory,
  args: {
    children: "<strong>lorem</strong> ispum",
    allowTags: ["a", "strong", "em"],
    allowHtml: true,
  },
};
