import { useEffect, useRef } from "react";

interface Options {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.05,
  once = true,
  rootMargin = "0px",
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: always show immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    function revealIfVisible() {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
        return true;
      }
      return false;
    }

    // Check immediately (covers normal scroll-into-view)
    if (revealIfVisible()) return;

    // Check again after the browser has had time to execute any hash-scroll.
    // Two rAF frames ensure the layout/scroll has settled.
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        if (revealIfVisible()) return;

        // Fall back to IntersectionObserver for elements below the fold
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                if (once) observer.unobserve(entry.target);
              } else if (!once) {
                entry.target.classList.remove("is-revealed");
              }
            });
          },
          { threshold, rootMargin }
        );
        if (el) observer.observe(el);
        // Safety net: reveal after 800 ms regardless
        const timer = setTimeout(() => {
          el?.classList.add("is-revealed");
          observer.disconnect();
        }, 800);
        // Capture observer/timer for cleanup
        (el as HTMLElement & { __svObserver?: IntersectionObserver; __svTimer?: number }).__svObserver = observer;
        (el as HTMLElement & { __svTimer?: number }).__svTimer = timer;
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      const _el = el as HTMLElement & { __svObserver?: IntersectionObserver; __svTimer?: number };
      _el.__svObserver?.disconnect();
      if (_el.__svTimer) clearTimeout(_el.__svTimer);
    };
  }, [threshold, once, rootMargin]);

  return ref;
}
