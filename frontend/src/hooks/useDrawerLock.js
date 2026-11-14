import { useEffect } from "react";

// While a mobile drawer is open: lock page scroll and close on Escape.
export function useDrawerLock(active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onClose]);
}
