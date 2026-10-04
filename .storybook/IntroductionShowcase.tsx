import { Accordion, Alert, Badge, Button, Logo, Notification, Skeleton, Slider } from "$uikit";
import type { Variant } from "$/types";

import "./introduction.css";

const palette: Variant[] = ["brand", "alt", "green", "blue", "purple", "orange", "pink", "yellow"];

const tiles = palette.map((variant) => (
  <div key={variant} className={`sb-intro-tile sb-intro-tile--${variant}`}>
    <Badge label={variant} variant={variant} type="plain" shape="pill" />
  </div>
));

export default function IntroductionShowcase() {
  return (
    <section className="sb-unstyled sb-intro-showcase" aria-label="Component showcase">
      <div className="sb-intro-card sb-intro-card--hero">
        <Logo variant="brand" type="full" className="sb-intro-logo" />
        <div className="sb-intro-row">
          <Badge label="React 19" variant="brand" type="light" shape="pill" />
          <Badge label="Accessible" variant="green" type="light" shape="pill" iconStart="check" />
          <Badge label="Themeable" variant="purple" type="light" shape="pill" iconStart="sparkles" />
        </div>
        <h2 className="sb-intro-title">Build consistent, accessible interfaces</h2>
        <p className="sb-intro-text">Components, design tokens and themes shared by every StudioB04 website.</p>
        <div className="sb-intro-row">
          <Button label="Get started" variant="brand" shape="pill" iconEnd="arrow-right" />
          <Button
            label="Inbox"
            variant="neutral"
            shape="outline"
            slotEnd={<Notification value={3} variant="red" />}
          />
        </div>
      </div>

      <div className="sb-intro-card">
        <Alert title="Changes saved" variant="green">
          Your preferences are up to date.
        </Alert>
        <Alert title="New release" variant="blue" persistant>
          A new version of the design system is available.
        </Alert>
      </div>

      <div className="sb-intro-card">
        <Accordion label="What's included?" name="sb-intro" open>
          React components, CSS design tokens, light and dark themes, a CSS reset and a Tailwind 4 theme.
        </Accordion>
        <Accordion label="Is it accessible?" name="sb-intro">
          Every component follows the W3C patterns and is tested with axe.
        </Accordion>
        <Accordion label="Can I customise it?" name="sb-intro">
          Yes: override the CSS custom properties, or switch between the light and dark themes.
        </Accordion>
      </div>

      <div className="sb-intro-card" aria-hidden="true">
        <div className="sb-intro-row sb-intro-row--nowrap">
          <Skeleton type="round" height="3rem" />
          <div className="sb-intro-stack">
            <Skeleton type="text" height="1rem" />
            <Skeleton type="text" height="0.75rem" />
          </div>
        </div>
        <Skeleton type="block" height="6rem" />
      </div>

      <div className="sb-intro-card sb-intro-card--wide">
        <Slider aria-label="Colour palette" items={tiles} dots />
      </div>
    </section>
  );
}
