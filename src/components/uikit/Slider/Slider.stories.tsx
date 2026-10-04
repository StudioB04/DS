import type { StoryObj } from "@storybook/react-vite";
import type { SliderProps } from "./Slider.types";
import Slider from "./Slider";

const widths = [60, 85, 50, 70, 95, 55, 80, 65, 90, 50, 75, 60, 85, 70, 55, 100];
const heights = [12, 20, 16, 28, 10, 24, 14, 18, 26, 12, 22, 16, 30, 10, 20, 14];

const items = widths.map((width, i) => (
  <div
    style={{
      inlineSize: `${width}cqi`,
      blockSize: `${heights[i]}rem`,
      display: "grid",
      placeItems: "center",
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "var(--ds-text-primary)",
      backgroundColor: "var(--ds-bg-secondary)",
      borderRadius: "var(--ds-radius-lg)",
    }}
  >
    Slide {i + 1}
  </div>
));

const sized = (width: string) => items.map((item) => <div style={{ inlineSize: width }}>{item}</div>);

const defaultArgs: SliderProps = {
  "aria-label": "Featured slides",
  items,
  arrows: true,
  dots: false,
  autoPlay: 0,
  slidePerPage: false,
  loop: false,
  prevLabel: "Previous slide",
  nextLabel: "Next slide",
  playLabel: "Start automatic slide show",
  pauseLabel: "Stop automatic slide show",
  dotLabel: "Go to slide",
  slideLabel: "{index} of {total}",
};

export default {
  title: "Components/uikit/Slider",
  component: Slider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'A carousel based on CSS scroll snap. Slides are rendered in a semantic `<ul>` / `<li>` list and each one can have its own width; the slider goes to the next or previous one. The list is a size container: use `cqi` units in a slide for a width relative to the slider (`60cqi` = 60% of its width).\n\nThe slider height follows the tallest visible slide, with a transition, and is updated as soon as a scroll starts. Edges with more slides beyond them fade out (always both with `loop`) to show that the slider can be scrolled.\n\nThe list can be scrolled with a trackpad, a touch screen, a mouse drag or the keyboard: once focused, `←` / `→` go to the previous / next slide and `Home` / `End` to the first / last one. `arrows` adds previous / next buttons, `dots` adds one navigation button per slide under the slider. With `slidePerPage`, navigation goes page by page: to the first slide that is partially hidden. With `loop`, the first slide follows the last one (and vice versa) without scrolling back; without it, the arrows are disabled at both ends. Right-to-left layouts (`dir="rtl"`) are supported.\n\n`autoPlay` (a delay in ms) adds a play / pause button and a progress bar.\n\nIt follows the [W3C carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/): `aria-label` is required to name the carousel; each slide is named with its position (`slideLabel`); the rotation button is the first focusable element; rotation pauses while the carousel is hovered and stops when keyboard focus enters it, until the user restarts it; the current slide is announced politely only when not rotating. With `dots`, the dots are a single focusable tab list (`aria-activedescendant` points to the selected dot): `←` / `→` go to the previous / next slide, `Home` / `End` to the first / last one; the slides are tab panels. Use the `*Label` props to translate the accessible labels.\n\nCustom properties: `--ds-slider-gap` sets the space between slides, `--ds-slider-fade-size` the width of the edge fade.',
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description:
        "The slides (ReactNode[]). Each slide keeps its own width; use `cqi` units for a width relative to the slider (`60cqi` = 60%).",
    },
    arrows: {
      control: "boolean",
      description: "Displays previous / next buttons.",
    },
    dots: {
      control: "boolean",
      description: "Displays one navigation button per slide under the slider.",
    },
    autoPlay: {
      control: "number",
      description: "Delay in ms between two slides: adds a play / pause button and a progress bar. `0` disables it.",
    },
    loop: {
      control: "boolean",
      description:
        "Infinite loop: the first slide follows the last one, without scrolling back. Without it, the arrows are disabled at both ends.",
    },
    slidePerPage: {
      control: "boolean",
      description: "Navigates page by page, to the first partially hidden slide.",
    },
    "aria-label": { control: "text", description: "Accessible name of the carousel (required)." },
    prevLabel: { control: "text", description: "Accessible label of the previous button." },
    nextLabel: { control: "text", description: "Accessible label of the next button." },
    playLabel: { control: "text", description: "Accessible label of the rotation button when stopped." },
    pauseLabel: { control: "text", description: "Accessible label of the rotation button when rotating." },
    dotLabel: { control: "text", description: "Accessible label of each dot." },
    slideLabel: {
      control: "text",
      description:
        "Accessible label of each slide, also announced when the current slide changes. `{index}` and `{total}` are replaced by the slide position and the number of slides.",
    },
  },
};

export const Default: StoryObj<SliderProps> = {
  args: { ...defaultArgs },
};

export const WithDots: StoryObj<SliderProps> = {
  args: {
    ...defaultArgs,
    dots: true,
  },
};

export const Loop: StoryObj<SliderProps> = {
  args: {
    ...defaultArgs,
    dots: true,
    loop: true,
  },
};

export const AutoPlay: StoryObj<SliderProps> = {
  args: {
    ...defaultArgs,
    autoPlay: 5000,
  },
};

export const SlidePerPage: StoryObj<SliderProps> = {
  args: {
    ...defaultArgs,
    items: sized("16rem"),
    dots: true,
    slidePerPage: true,
  },
};
