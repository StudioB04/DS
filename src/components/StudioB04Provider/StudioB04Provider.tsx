"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dialog from "$uikit/Dialog/Dialog";
import type { DialogHandle } from "$uikit/types";
import { StudioB04Context } from "./StudioB04Provider.context";
import type { DialogOptions, StudioB04ProviderProps } from "./StudioB04Provider.types";

interface ActiveDialog {
  key: number;
  options: DialogOptions;
}

export default function StudioB04Provider({ children }: StudioB04ProviderProps) {
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const counter = useRef(0);
  const dialogRef = useRef<DialogHandle>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const isShownRef = useRef(false);

  useEffect(() => {
    if (dialog) (dialogRef.current as DialogHandle).open();
  }, [dialog]);

  const showDialog = useCallback((options: DialogOptions) => {
    if (!isShownRef.current) invokerRef.current = document.activeElement as HTMLElement | null;
    isShownRef.current = true;
    counter.current += 1;
    setDialog({ key: counter.current, options });
  }, []);

  const hideDialog = useCallback(() => dialogRef.current?.close(), []);

  const value = useMemo(() => ({ showDialog, hideDialog }), [showDialog, hideDialog]);

  const createCloseHandler = (current: ActiveDialog) => (event: ToggleEvent) => {
    isShownRef.current = false;
    current.options.onClose?.(event);

    const invoker = invokerRef.current;
    if (invoker?.isConnected && invoker !== document.body) invoker.focus();

    const animations = (event.currentTarget as HTMLDialogElement).getAnimations({ subtree: true });
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() =>
      setDialog((latest) => (latest?.key === current.key ? null : latest)),
    );
  };

  return (
    <StudioB04Context.Provider value={value}>
      {children}

      {dialog && <Dialog {...dialog.options} key={dialog.key} ref={dialogRef} onClose={createCloseHandler(dialog)} />}
    </StudioB04Context.Provider>
  );
}
