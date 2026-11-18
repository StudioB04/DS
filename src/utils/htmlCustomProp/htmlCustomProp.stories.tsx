import { useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { UtilResult } from "../../../.storybook/UtilDemo";
import { setHTMLCustomProp } from "./htmlCustomProp";

type MeasuredProperty = "clientWidth" | "clientHeight" | "offsetWidth" | "offsetHeight";

interface HTMLCustomPropArgs {
  property: MeasuredProperty;
  name: string;
}

const defaultArgs: HTMLCustomPropArgs = {
  property: "clientWidth",
  name: "--box-size",
};

function HTMLCustomPropDemo({ property, name }: Readonly<HTMLCustomPropArgs>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    const observer = new MutationObserver(() => setValue(container.style.getPropertyValue(name)));

    observer.observe(container, { attributes: true, attributeFilter: ["style"] });
    const cleanup = setHTMLCustomProp(boxRef.current, property, name, container);

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [property, name]);

  return (
    <UtilResult call={`setHTMLCustomProp(box, "${property}", "${name}", container)`}>
      <div ref={containerRef} style={{ display: "grid", gap: "var(--ds-spacing-md)" }}>
        <div
          ref={boxRef}
          style={{
            inlineSize: "50vw",
            maxInlineSize: "100%",
            blockSize: "20vh",
            display: "grid",
            placeItems: "center",
            color: "var(--ds-text-inverse-primary)",
            backgroundColor: "var(--ds-bg-brand-solid)",
            borderRadius: "var(--ds-radius-md)",
            fontFamily: "var(--ds-font-sans)",
            textAlign: "center",
          }}
        >
          Resize the window
        </div>
        <output>
          <strong>
            {name}: {value}
          </strong>
        </output>
      </div>
    </UtilResult>
  );
}

export default {
  title: "Utils/setHTMLCustomProp",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Copies a measure of an element into a CSS custom property, so that it can be used in CSS (a sticky offset under a header, the height of a footer…). It is exported from `@studio_b04/ds/utils`:\n\n```ts\nimport { setHTMLCustomProp } from "@studio_b04/ds/utils";\n```\n\n`setHTMLCustomProp(element, property, name, attachStyleTo = document.documentElement)` writes `element[property]` in pixels (`0px` when there is no element) into the `name` custom property of the `attachStyleTo` element, right away, on every window `resize` (debounced by 100 ms) and whenever the element itself changes size (content, fonts, zoom, animations), thanks to a `ResizeObserver` when the browser provides one.\n\nIt returns a cleanup function that cancels the pending update, disconnects the observer, refreshes the property one last time and removes the `resize` listener, so it can be returned as is from an effect.',
      },
    },
  },
  argTypes: {
    property: {
      control: "select",
      options: ["clientWidth", "clientHeight", "offsetWidth", "offsetHeight"],
      description: "The numeric property of the element to copy (any property of `HTMLElement` works).",
    },
    name: {
      control: "text",
      description: "The name of the custom property, with its leading `--`.",
    },
  },
};

export const Default: StoryObj<HTMLCustomPropArgs> = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "The box is sized with viewport units: resize the window and the custom property of the container follows, 100 ms after the last resize (a change of the element's own size updates it right away). In CSS, use it with `var()` (`inset-block-start: var(--box-size)`).",
      },
      source: {
        type: "code",
        transform: (_code: string, context: { args: HTMLCustomPropArgs }) =>
          `import { useEffect, useRef } from "react";\nimport { setHTMLCustomProp } from "@studio_b04/ds/utils";\n\nconst headerRef = useRef<HTMLElement>(null);\n\nuseEffect(() => setHTMLCustomProp(headerRef.current, "${context.args.property}", "${context.args.name}"), []);`,
      },
    },
  },
  render: ({ property, name }) => <HTMLCustomPropDemo property={property} name={name} />,
};
