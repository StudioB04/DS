import { Fragment, useState } from "react";
import { Accordion, Alert, Badge, Button, Divider, Icon, Skeleton, SkipLink, Slider } from "$uikit";

const VARIANTS = ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink"] as const;

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.dsTheme = nextTheme;
  };

  return (
    <>
      <SkipLink label="Go to section colors" anchor="#colors" />
      <SkipLink label="Go to section buttons" anchor="#buttons" />

      <header className="sticky top-none z-10 flex items-center justify-between border-primary border-be px-xl py-xl text-primary bg-secondary">
        <h1 className="text-title-lg font-bold">StudioB04 DS Sandbox</h1>
        <Button
          label={`Thème : ${theme}`}
          variant="neutral"
          shape="outline"
          size="sm"
          onClick={toggleTheme}
          iconStart={theme === "light" ? "sun" : "moon"}
        />
      </header>

      <div className="container mx-auto min-bs-dvh px-xl flex flex-col gap-6xl pbs-6xl pbe-3xl">
        <section id="colors" className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Couleurs</h2>

          {["gray", "fuschia", "teal", "green", "red", "orange", "blue", "purple", "yellow", "pink"].map((color) => (
            <Fragment key={color}>
              <h3 className="font-semibold">{color}</h3>
              <div className="flex gap-sm">
                <div
                  className="rounded-xs inline-[6rem] block-[4rem]"
                  style={{ backgroundColor: `var(--ds-color-${color}-50)` }}
                />
                {new Array(8).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xs inline-[6rem] block-[4rem]"
                    style={{ backgroundColor: `var(--ds-color-${color}-${(index + 1) * 100})` }}
                  />
                ))}
                <div
                  className="rounded-xs inline-[6rem] block-[4rem]"
                  style={{ backgroundColor: `var(--ds-color-${color}-950)` }}
                />
              </div>
            </Fragment>
          ))}
        </section>

        <section id="buttons" className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold ">Button — variants</h2>
          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Button key={variant} shape="square" label={variant} variant={variant} size="md" />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Button shape="square" label="inverse" variant="inverse" size="md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Button key={variant} shape="pill" label={variant} variant={variant} size="md" />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Button shape="pill" label="inverse" variant="inverse" size="md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Button key={variant} shape="outline" label={variant} variant={variant} size="md" />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Button shape="outline" label="inverse" variant="inverse" size="md" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Badge — variants</h2>
          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Badge key={variant} type="light" label={variant} variant={variant} />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Badge type="light" label="inverse" variant="inverse" />
            </div>
          </div>

          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Badge key={variant} type="plain" label={variant} variant={variant} />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Badge type="plain" label="inverse" variant="inverse" />
            </div>
          </div>

          <div className="flex flex-wrap gap-xl items-center">
            {VARIANTS.map((variant) => (
              <Badge key={variant} type="clear" label={variant} variant={variant} />
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Badge type="clear" label="inverse" variant="inverse" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Accordion</h2>
          <div>
            <Accordion
              name="accordion"
              label="Lorem *ipsum* dolor sit amet"
              slotStart={<Icon src="circle-question-mark" size={20} />}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
              dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
              massa, varius a, semper congue, euismod non, mi.
            </Accordion>
            <Divider size="sm" />
            <Accordion
              name="accordion"
              label="consectetur **adipisicing** elit. Delectus, porro."
              slotStart={<Icon src="circle-question-mark" size={20} />}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
              dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
              massa, varius a, semper congue, euismod non, mi.
            </Accordion>
            <Divider size="sm" />
          </div>
        </section>

        <section className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Alert</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(40rem,1fr))] gap-xl ">
            {VARIANTS.map((variant) => (
              <Alert
                key={variant}
                title={`Lorem **ipsum** (${variant})`}
                variant={variant}
                titleSlotStart={<Icon src="circle-check" size={20} />}
              >
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                dignissim sit amet, adipiscing nec, ultricies sed, dolor.
              </Alert>
            ))}

            <div className="bg-inverse-primary p-lg rounded-xs">
              <Alert
                title={`Lorem **ipsum** (inverse)`}
                variant="inverse"
                titleSlotStart={<Icon src="circle-check" size={20} />}
              >
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                dignissim sit amet, adipiscing nec, ultricies sed, dolor.
              </Alert>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Skeleton</h2>
          <div className="flex gap-xl items-start">
            <Skeleton height="3rem" type="round" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton height="12px" type="text" />
              <Skeleton height="100px" type="text" />
            </div>
          </div>
          <Skeleton height="6rem" type="block" />
        </section>

        <section className="flex flex-col gap-xl">
          <h2 className="text-title-sm font-semibold">Slider</h2>
          <Slider
            aria-label="Exemple de slider"
            dots
            autoPlay={4000}
            items={["60cqi", "35cqi", "45cqi", "70cqi", "30cqi", "50cqi"].map((width, i) => (
              <div
                className="grid place-items-center bg-secondary rounded-lg text-title-sm font-semibold"
                style={{ inlineSize: width, minInlineSize: "12rem", blockSize: "10rem" }}
              >
                Slide {i + 1}
              </div>
            ))}
          />
        </section>
      </div>
    </>
  );
}
