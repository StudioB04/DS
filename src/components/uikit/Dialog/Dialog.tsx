"use client";

import { useEffect, useId, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import FocusTrap from "$uikit/FocusTrap/FocusTrap";
import { getInteractiveDomNodes } from "$uikit/FocusTrap/FocusTrap.utils";
import Icon from "$uikit/Icon/Icon";
import Markdown from "$uikit/Markdown/Markdown";
import type { DialogProps } from "./Dialog.types";

import "./Dialog.css";

export default function Dialog({
  title,
  description,
  headerSlot,
  children,
  footer,
  persistent = false,
  size = "md",
  position = "center",
  closeLabel = "Close",
  onOpen,
  onClose,
  ref,
  className,
  ...restProps
}: DialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const invokerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  });

  const show = () => (dialogRef.current as HTMLDialogElement).togglePopover(true);

  const hide = () => (dialogRef.current as HTMLDialogElement).togglePopover(false);

  useImperativeHandle(ref, () => ({ open: show, close: hide }));

  useEffect(() => {
    const dialog = dialogRef.current as HTMLDialogElement;

    const handleBeforeToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "open") {
        invokerRef.current = document.activeElement as HTMLElement | null;
      }
    };

    const handleToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "open") {
        const [firstFocusable = dialog] = getInteractiveDomNodes(dialog).filter(
          (element) => !element.classList.contains("ds-focus-trap__button"),
        );
        firstFocusable.focus();
        onOpenRef.current?.();
        return;
      }

      const invoker = invokerRef.current;
      if (invoker?.isConnected && invoker !== document.body) invoker.focus();
      onCloseRef.current?.(event as ToggleEvent);
    };

    const ac = new AbortController();

    dialog.addEventListener("beforetoggle", handleBeforeToggle, { signal: ac.signal });
    dialog.addEventListener("toggle", handleToggle, { signal: ac.signal });

    return () => ac.abort();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      popover={persistent ? "manual" : "auto"}
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      className={clsx(
        "ds-dialog",
        `ds-dialog--size-${size}`,
        `ds-dialog--position-${position}`,
        persistent && "ds-dialog--persistent",
        className,
      )}
      tabIndex={-1}
      {...restProps}
    >
      <FocusTrap>
        {!persistent && (
          <button type="button" className="ds-dialog__close" aria-label={closeLabel} title={closeLabel} onClick={hide}>
            <Icon src="x" size={20} />
          </button>
        )}

        {headerSlot && <div className="ds-dialog__header__slot">{headerSlot}</div>}

        <header className="ds-dialog__header">
          <h2 id={`${id}-title`} className="ds-dialog__header__title">
            {title}
          </h2>
          {description && (
            <div id={`${id}-description`} className="ds-dialog__header__description">
              <Markdown>{description}</Markdown>
            </div>
          )}
        </header>

        <div className="ds-dialog__body">{children}</div>

        {footer && <footer className="ds-dialog__footer">{footer}</footer>}
      </FocusTrap>
    </dialog>
  );
}
