import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = { once: true, rootMargin: "0px", threshold: 0.12 };

export default function useInView(options = DEFAULT_OPTIONS) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const { once = true, rootMargin = "0px", threshold = 0.12 } = options;

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, isInView];
}
