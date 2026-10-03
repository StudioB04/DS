import { useState } from "react";
import { Badge, Button } from "$uikit";


const VARIANTS = ["neutral", "brand", "alt", "green", "red", "orange", "blue", "purple", "yellow", "pink"] as const;

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.dsTheme = nextTheme;
  };

  return (
    <div className="min-bs-dvh mx-auto max-w-5xl px-4 flex flex-col gap-6">
      <header className="flex items-center justify-between border-primary border-be py-4 mbe-4">
        <h1 className="text-title-lg font-bold">StudioB04 DS Sandbox</h1>
        <Button label={`Thème : ${theme}`} variant="neutral" shape="outline" size="sm" onClick={toggleTheme} />
      </header>

      <section className="flex flex-col gap-2">
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

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold ">Button — variants</h2>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((variant) => (
            <Button key={variant} label={variant} variant={variant} size="md" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-title-sm font-semibold">Badge — variants</h2>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((variant) => (
            <Badge key={variant} label={variant} variant={variant} />
          ))}
        </div>
      </section>
    </div >
  );
}
