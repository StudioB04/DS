import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StudioB04Provider from "$/components/StudioB04Provider/StudioB04Provider";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("#root introuvable");
}

createRoot(container).render(
  <StrictMode>
    <StudioB04Provider>
      <App />
    </StudioB04Provider>
  </StrictMode>,
);
