import { useEffect, useRef, type RefObject } from "react";

export type OutsideClickEvent = MouseEvent | TouchEvent;

type OutsideClickHandler = (event: OutsideClickEvent) => void;

export function useOutsideClick<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  onOutsideClick: OutsideClickHandler,
  enabled = true,
): void {
  const handlerRef = useRef(onOutsideClick);

  useEffect(() => {
    handlerRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    if (!enabled) return;

    const handleOutsideEvent = (event: OutsideClickEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!targetRef.current?.contains(event.target)) handlerRef.current(event);
    };

    document.addEventListener("mousedown", handleOutsideEvent);
    document.addEventListener("touchstart", handleOutsideEvent, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideEvent);
      document.removeEventListener("touchstart", handleOutsideEvent);
    };
  }, [enabled, targetRef]);
}
