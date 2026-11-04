// მითითებული ელემენტის გარეთ დაკლიკებას ამოიცნობს და callback-ს იძახებს.
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
    // callback-ის უახლეს ვერსიას ref-ში ვინახავთ, რათა listener-მა ძველი ფუნქცია არ გამოიყენოს.
    handlerRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    if (!enabled) return;

    // callback იძახება, როცა დაჭერის სამიზნე მითითებული ელემენტის გარეთაა.
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
