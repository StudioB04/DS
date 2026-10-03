import type { StoryObj } from "@storybook/react-vite";
import type { SliderProps } from "./Slider.types";
import Slider from "./Slider";

const items = new Array(16).fill(null).map((_, i) => (
  <div
    style={{
      inlineSize: `${Math.max(Math.floor(Math.random() * 100), 50)}cqi`,
      blockSize: `${Math.max(Math.floor(Math.random() * 30), 10)}rem`,
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
};

export default {
  title: "Components/uikit/Slider",
  component: Slider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A carousel based on CSS scroll snap. Slides are rendered in a semantic `<ul>` / `<li>` list and each one can have its own width; the slider goes to the next or previous one. The list is a size container: use `cqi` units in a slide for a width relative to the slider (`60cqi` = 60% of its width).\n\nThe list can be scrolled with a trackpad, a touch screen or the keyboard: once focused, `←` / `→` go to the previous / next slide and `Home` / `End` to the first / last one. `arrows` adds previous / next buttons, `dots` adds one navigation button per slide under the slider. With `slidePerPage`, navigation goes page by page: to the first slide that is partially hidden. With `loop`, the first slide follows the last one (and vice versa) without scrolling back; without it, the arrows are disabled at both ends.\n\n`autoPlay` (a delay in ms) adds a play / pause button and a progress bar.\n\nIt follows the [W3C carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/): the rotation button is the first focusable element; rotation pauses while the carousel is hovered and stops when keyboard focus enters it, until the user restarts it; slides are announced politely (`aria-live`) only when not rotating. With `dots`, the dots are a single focusable tab list (`aria-activedescendant` points to the selected dot): `←` / `→` go to the previous / next slide, `Home` / `End` to the first / last one; the slides are tab panels. Set `aria-label` to name the carousel, and the `*Label` props to translate the accessible labels.",
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
    prevLabel: { control: "text", description: "Accessible label of the previous button." },
    nextLabel: { control: "text", description: "Accessible label of the next button." },
    playLabel: { control: "text", description: "Accessible label of the rotation button when stopped." },
    pauseLabel: { control: "text", description: "Accessible label of the rotation button when rotating." },
    dotLabel: { control: "text", description: "Accessible label of each dot" },
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
