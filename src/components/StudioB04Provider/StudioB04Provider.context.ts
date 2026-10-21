import { createContext } from "react";
import type { StudioB04ContextValue } from "./StudioB04Provider.types";

export const StudioB04Context = createContext<StudioB04ContextValue | null>(null);
