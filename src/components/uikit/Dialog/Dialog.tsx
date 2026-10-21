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
  open = false,
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
  const invokerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });

  const show = () => {
    const dialog = dialogRef.current as HTMLDialogElement;
    if (dialog.open) return;

    invokerRef.current = document.activeElement as HTMLElement | null;
    dialog.showModal();

    const [firstFocusable = dialog] = getInteractiveDomNodes(dialog).filter(
      (element) => !element.classList.contains("ds-focus-trap__button"),
    );
    firstFocusable.focus();

    onOpenRef.current?.();
  };

  const hide = () => dialogRef.current?.close();

  useImperativeHandle(ref, () => ({ open: show, close: hide }));

  useEffect(() => {
    if (open) show();
    else hide();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current as HTMLDialogElement;
    let pressedTarget: EventTarget | null = null;

    const handleMouseDown = (event: MouseEvent) => {
      pressedTarget = event.target;
    };
    const handleClick = (event: MouseEvent) => {
      if (!persistent && event.target === dialog && pressedTarget === dialog) hide();
    };

    const handleClose = () => {
      const invoker = invokerRef.current;
      if (invoker?.isConnected && invoker !== document.body) invoker.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (persistent && event.key === "Escape") event.preventDefault();
    };

    const ac = new AbortController();

    dialog.addEventListener("mousedown", handleMouseDown, { signal: ac.signal });
    dialog.addEventListener("click", handleClick, { signal: ac.signal });
    dialog.addEventListener("keydown", handleKeyDown, { signal: ac.signal });
    dialog.addEventListener("close", handleClose, { signal: ac.signal });

    return () => ac.abort();
  }, [persistent]);

  useEffect(() => {}, [persistent]);

  const hasHeader = Boolean(title) || Boolean(description);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      className={clsx(
        "ds-dialog",
        `ds-dialog--size-${size}`,
        `ds-dialog--position-${position}`,
        persistent && "ds-dialog--persistent",
        className,
      )}
      tabIndex={-1}
      onClose={onClose}
      {...restProps}
    >
      <FocusTrap>
        {!persistent && (
          <button type="button" className="ds-dialog__close" aria-label={closeLabel} title={closeLabel} onClick={hide}>
            <Icon src="x" size={20} />
          </button>
        )}

        {headerSlot && <div className="ds-dialog__header__slot">{headerSlot}</div>}

        {hasHeader && (
          <header className="ds-dialog__header">
            {title && (
              <h2 id={`${id}-title`} className="ds-dialog__header__title">
                {title}
              </h2>
            )}
            {description && (
              <div id={`${id}-description`} className="ds-dialog__header__description">
                <Markdown>{description}</Markdown>
              </div>
            )}
          </header>
        )}

        <div className="ds-dialog__body">{children}</div>

        {footer && <footer className="ds-dialog__footer">{footer}</footer>}
      </FocusTrap>
    </dialog>
  );
}
