import { Fragment, useState } from "react";
import { Accordion, Alert, Badge, Button, SkipLink } from "$uikit";

const VARIANTS = ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple"] as const;

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

      <div className="container mx-auto">
        <Accordion label="box Shadows">
          <div className="flex gap-sm pbe-4xl">
            {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
              <Fragment key={size}>
                <div className="flex gap-sm">
                  <div
                    className="rounded-xs inline-[8rem] block-[4rem] flex items-center justify-center bg-secondary"
                    style={{ boxShadow: `var(--ds-box-shadow-${size})` }}
                  >
                    <h3 className="font-semibold">{size}</h3>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </Accordion>

        <Accordion label="Couleurs">
          <div className="flex flex-col gap-sm">
            {["gray", "fuschia", "teal", "green", "red", "orange", "blue", "purple"].map((color) => (
              <Fragment key={color}>
                <h3 className="font-semibold">{color}</h3>
                <div className="flex gap-sm">
                  <div
                    className="rounded-xs inline-[8rem] block-[4rem]"
                    style={{ backgroundColor: `var(--ds-color-${color}-50)` }}
                  />
                  {new Array(8).fill(null).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xs inline-[8rem] block-[4rem]"
                      style={{ backgroundColor: `var(--ds-color-${color}-${(index + 1) * 100})` }}
                    />
                  ))}
                  <div
                    className="rounded-xs inline-[8rem] block-[4rem]"
                    style={{ backgroundColor: `var(--ds-color-${color}-950)` }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </Accordion>

        <Accordion label="Couleurs de texte">
          <div className="flex flex-col gap-sm">
            <div className="flex gap-5xl">
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-placeholder)` }}>
                Text placeholder
              </p>
            </div>

            <div className="flex gap-5xl">
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-primary)` }}>
                Text primary
              </p>
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-secondary)` }}>
                Text secondary
              </p>
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-tertiary)` }}>
                Text tertiary
              </p>
            </div>

            <div className="flex gap-5xl">
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-inverse-primary)` }}>
                Text inverse primary
              </p>
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-inverse-secondary)` }}>
                Text inverse secondary
              </p>
              <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-inverse-tertiary)` }}>
                Text inverse tertiary
              </p>
            </div>

            {VARIANTS.map((color) => (
              <Fragment key={color}>
                <div className="flex gap-5xl">
                  <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-${color}-primary)` }}>
                    Text {color} primary
                  </p>
                  <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-${color}-secondary)` }}>
                    Text {color} secondary
                  </p>
                  <p className="text-lg font-ultrabold" style={{ color: `var(--ds-text-${color}-tertiary)` }}>
                    Text {color} tertiary
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </Accordion>

        <Accordion label="Couleurs de fond">
          <div className="flex flex-col gap-3xl">
            <div className="flex gap-3xl">
              <div className="flex flex-col gap-sm">
                <p className="font-bold">primary</p>
                <div className="inline-[10rem] aspect-video" style={{ backgroundColor: `var(--ds-bg-primary)` }}></div>
              </div>
              <div className="flex flex-col gap-sm">
                <p className="font-bold">secondary</p>
                <div
                  className="inline-[10rem] aspect-video"
                  style={{ backgroundColor: `var(--ds-bg-secondary)` }}
                ></div>
              </div>
              <div className="flex flex-col gap-sm">
                <p className="font-bold">tertiary</p>
                <div className="inline-[10rem] aspect-video" style={{ backgroundColor: `var(--ds-bg-tertiary)` }}></div>
              </div>
            </div>

            <div className="flex gap-3xl">
              <div className="flex flex-col gap-sm">
                <p className="font-bold">inverse primary</p>
                <div
                  className="inline-[10rem] aspect-video"
                  style={{ backgroundColor: `var(--ds-bg-inverse-primary)` }}
                ></div>
              </div>
              <div className="flex flex-col gap-sm">
                <p className="font-bold">inverse secondary</p>
                <div
                  className="inline-[10rem] aspect-video"
                  style={{ backgroundColor: `var(--ds-bg-inverse-secondary)` }}
                ></div>
              </div>
              <div className="flex flex-col gap-sm">
                <p className="font-bold">inverse tertiary</p>
                <div
                  className="inline-[10rem] aspect-video"
                  style={{ backgroundColor: `var(--ds-bg-inverse-tertiary)` }}
                ></div>
              </div>
            </div>

            {VARIANTS.map((color) => (
              <div className="flex gap-3xl" key={color}>
                <div className="flex flex-col gap-sm">
                  <p className="font-bold">{color} primary</p>
                  <div
                    className="inline-[10rem] aspect-video"
                    style={{ backgroundColor: `var(--ds-bg-${color}-primary)` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-sm">
                  <p className="font-bold">{color} secondary</p>
                  <div
                    className="inline-[10rem] aspect-video"
                    style={{ backgroundColor: `var(--ds-bg-${color}-secondary)` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-sm">
                  <p className="font-bold">{color} tertiary</p>
                  <div
                    className="inline-[10rem] aspect-video"
                    style={{ backgroundColor: `var(--ds-bg-${color}-tertiary)` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-sm">
                  <p className="font-bold">{color} solid</p>
                  <div
                    className="inline-[10rem] aspect-video"
                    style={{ backgroundColor: `var(--ds-bg-${color}-solid)` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-sm">
                  <p className="font-bold">{color} solid hover</p>
                  <div
                    className="inline-[10rem] aspect-video"
                    style={{ backgroundColor: `var(--ds-bg-${color}-solid_hover)` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        <Accordion label="Couleurs de bordure">
          <div className="flex flex-col gap-3xl">
            <div className="flex gap-3xl">
              <p className="font-bold border-2 p-xl rounded-sm text-primary border-primary">Border primary</p>
              <p className="font-bold border-2 p-xl rounded-sm text-primary border-secondary">Border secondary</p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-tertiary">
                Border tertiary
              </p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-solid">Border solid</p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-solid_hover">
                Border solid hover
              </p>
            </div>

            <div className="flex gap-3xl">
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-inverse-primary">
                Border inverse primary
              </p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-inverse-secondary">
                Border inverse secondary
              </p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-inverse-tertiary">
                Border inverse tertiary
              </p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-inverse-solid">
                Border inverse solid
              </p>
              <p className="text-lg font-ultrabold border-2 p-xl rounded-sm text-primary border-inverse-solid_hover">
                Border inverse solid hover
              </p>
            </div>

            {VARIANTS.map((color) => (
              <Fragment key={color}>
                <div className="flex gap-3xl">
                  <p
                    className="text-lg font-ultrabold border-2 border-solid p-xl rounded-sm text-primary"
                    style={{
                      borderColor: `var(--ds-border-${color}-primary)`,
                      color: `var(--ds-text-${color}-primary)`,
                    }}
                  >
                    Border {color} primary
                  </p>
                  <p
                    className="text-lg font-ultrabold border-2 border-solid p-xl rounded-sm text-primary"
                    style={{
                      borderColor: `var(--ds-border-${color}-secondary)`,
                      color: `var(--ds-text-${color}-primary)`,
                    }}
                  >
                    Border {color} secondary
                  </p>
                  <p
                    className="text-lg font-ultrabold border-2 border-solid p-xl rounded-sm text-primary"
                    style={{
                      borderColor: `var(--ds-border-${color}-tertiary)`,
                      color: `var(--ds-text-${color}-primary)`,
                    }}
                  >
                    Border {color} tertiary
                  </p>
                  <p
                    className="text-lg font-ultrabold border-2 border-solid p-xl rounded-sm text-primary"
                    style={{
                      borderColor: `var(--ds-border-${color}-solid)`,
                      color: `var(--ds-text-${color}-primary)`,
                    }}
                  >
                    Border {color} solid
                  </p>
                  <p
                    className="text-lg font-ultrabold border-2 border-solid p-xl rounded-sm text-primary"
                    style={{
                      borderColor: `var(--ds-border-${color}-solid_hover)`,
                      color: `var(--ds-text-${color}-primary)`,
                    }}
                  >
                    Border {color} solid hover
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </Accordion>

        <Accordion label="Buttons">
          <div className="flex flex-col gap-3xl">
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
          </div>
        </Accordion>

        <Accordion label="Badge">
          <div className="flex flex-col gap-3xl">
            <div className="flex flex-wrap gap-xl items-center">
              <h3 className="text-lg">Light</h3>
              {VARIANTS.map((variant) => (
                <Badge key={variant} type="light" label={variant} variant={variant} />
              ))}

              <div className="bg-inverse-primary p-lg rounded-xs">
                <Badge type="light" label="inverse" variant="inverse" />
              </div>
            </div>

            <div className="flex flex-wrap gap-xl items-center">
              <h3 className="text-lg">Plain</h3>
              {VARIANTS.map((variant) => (
                <Badge key={variant} type="plain" label={variant} variant={variant} />
              ))}

              <div className="bg-inverse-primary p-lg rounded-xs">
                <Badge type="plain" label="inverse" variant="inverse" />
              </div>
            </div>

            <div className="flex flex-wrap gap-xl items-center">
              <h3 className="text-lg">Clear</h3>
              {VARIANTS.map((variant) => (
                <Badge key={variant} type="clear" label={variant} variant={variant} />
              ))}

              <div className="bg-inverse-primary p-lg rounded-xs">
                <Badge type="clear" label="inverse" variant="inverse" />
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion label="Alert" open>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3xl">
            {VARIANTS.map((variant) => (
              <Alert key={variant} variant={variant} title={variant}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero laudantium tempore, blanditiis iusto atque
                sequi qui ratione eligendi quaerat recusandae!
              </Alert>
            ))}

            <Alert variant="inverse" title="inverse">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero laudantium tempore, blanditiis iusto atque
              sequi qui ratione eligendi quaerat recusandae!
            </Alert>
          </div>
        </Accordion>
      </div>
    </>
  );
}
