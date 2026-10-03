import { useState } from "react";
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
    <div className="min-bs-dvh mx-auto  px-4 flex flex-col gap-6 pbe-10">
      <SkipLink label="Go to section colors" anchor="#colors" />
      <SkipLink label="Go to section buttons" anchor="#buttons" />

      <header className="flex items-center justify-between border-primary border-be py-4 mbe-4">
        <h1 className="text-title-lg font-bold">StudioB04 DS Sandbox</h1>
        <Button label={`Thème : ${theme}`} variant="neutral" shape="outline" size="sm" onClick={toggleTheme} />
      </header>

      <section id="colors" className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Couleurs sémantiques</h2>
        <div className="flex flex-wrap gap-3">
          <div className="bg-primary border border-primary rounded-md p-4 w-40 text-sm">bg-primary</div>
          <div className="bg-secondary border border-primary rounded-md p-4 w-40 text-sm">bg-secondary</div>
          <div className="bg-tertiary border border-primary rounded-md p-4 w-40 text-sm">bg-tertiary</div>
          <div className="bg-primary border border-primary rounded-md p-4 w-40">
            <p className="text-primary text-sm">text-primary</p>
            <p className="text-secondary text-sm">text-secondary</p>
            <p className="text-tertiary text-sm">text-tertiary</p>
          </div>
        </div>
      </section>

      <section id="buttons" className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold ">Button — variants</h2>
        <div className="flex flex-wrap gap-1">
          {VARIANTS.map((variant) => (
            <Button key={variant} shape="square" label={variant} variant={variant} size="md" />
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {VARIANTS.map((variant) => (
            <Button key={variant} shape="pill" label={variant} variant={variant} size="md" />
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {VARIANTS.map((variant) => (
            <Button key={variant} shape="outline" label={variant} variant={variant} size="md" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Badge — variants</h2>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((variant) => (
            <Badge key={variant} type="light" label={variant} variant={variant} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((variant) => (
            <Badge key={variant} type="plain" label={variant} variant={variant} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((variant) => (
            <Badge key={variant} type="clear" label={variant} variant={variant} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Accordion</h2>
        <div>
          <Accordion name="accordion" label="Lorem *ipsum* dolor sit amet" slotStart={<Icon src="circle-question-mark" size={20} />}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
          </Accordion>
          <Divider size="sm" />
          <Accordion name="accordion" label="consectetur **adipisicing** elit. Delectus, porro." slotStart={<Icon src="circle-question-mark" size={20} />}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
          </Accordion>
          <Divider size="sm" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Alert</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(40rem,1fr))] gap-2">
          {VARIANTS.map((variant) => (
            <Alert key={variant} title={`Lorem **ipsum** (${variant})`} variant={variant} titleSlotStart={<Icon src="circle-check" size={20} />}>
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
            </Alert>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Skeleton</h2>
        <div className="flex gap-4 items-start">
          <Skeleton height="3rem" type="round" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton height="12px" type="text" />
            <Skeleton height="100px" type="text" />
          </div>
        </div>
        <Skeleton height="6rem" type="block" />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Slider</h2>
        <Slider
          aria-label="Exemple de slider"
          dots
          autoPlay={4000}
          items={["60cqi", "35cqi", "45cqi", "70cqi", "30cqi", "50cqi"].map((width, i) => (
            <div className="grid place-items-center bg-secondary rounded-lg text-title-sm font-semibold" style={{ inlineSize: width, minInlineSize: "12rem", blockSize: "10rem" }}>
              Slide {i + 1}
            </div>
          ))}
        />
      </section>
    </div >
  );
}
