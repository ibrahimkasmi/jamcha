// src/shared/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T | null>, boolean] => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    root = null,
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(target);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  return [targetRef, isIntersecting];
};
  