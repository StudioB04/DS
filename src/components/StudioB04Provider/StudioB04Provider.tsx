"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import Dialog from "$uikit/Dialog/Dialog";
import { StudioB04Context } from "./StudioB04Provider.context";
import type { DialogOptions, StudioB04ProviderProps } from "./StudioB04Provider.types";

interface ActiveDialog {
  key: number;
  options: DialogOptions;
}

export default function StudioB04Provider({ children }: StudioB04ProviderProps) {
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const [open, setOpen] = useState(false);
  const counter = useRef(0);
  const invokerRef = useRef<HTMLElement | null>(null);
  const isShownRef = useRef(false);

  const showDialog = useCallback((options: DialogOptions) => {
    if (!isShownRef.current) invokerRef.current = document.activeElement as HTMLElement | null;
    isShownRef.current = true;
    counter.current += 1;
    setDialog({ key: counter.current, options });
    setOpen(true);
  }, []);

  const hideDialog = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ showDialog, hideDialog }), [showDialog, hideDialog]);

  const createCloseHandler = (current: ActiveDialog) => (event: SyntheticEvent<HTMLDialogElement>) => {
    setOpen(false);
    isShownRef.current = false;
    current.options.onClose?.(event);

    const invoker = invokerRef.current;
    if (invoker?.isConnected && invoker !== document.body) invoker.focus();

    const animations = event.currentTarget.getAnimations({ subtree: true });
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() =>
      setDialog((latest) => (latest?.key === current.key ? null : latest)),
    );
  };

  return (
    <StudioB04Context.Provider value={value}>
      {children}

      {dialog && <Dialog {...dialog.options} key={dialog.key} open={open} onClose={createCloseHandler(dialog)} />}
    </StudioB04Context.Provider>
  );
}
