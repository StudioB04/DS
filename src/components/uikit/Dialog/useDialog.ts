"use client";

import { useContext } from "react";
import { StudioB04Context } from "./StudioB04Provider.context";

export default function useDialog() {
  const context = useContext(StudioB04Context);

  if (!context) {
    throw new Error("useDialog must be used within a StudioB04Provider");
  }

  const { showDialog, hideDialog } = context;

  return { showDialog, hideDialog };
}
