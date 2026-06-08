import { ElementType, ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Variant = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  /** Animation direction */
  variant?: Variant;
  /** Stagger delay in ms */
  delay?: number;
  /** Render as a different tag (div by default) */
  as?: ElementType;
  className?: string;
  /** Re-trigger every time it enters view */
  repeat?: boolean;
}

const fromVars: Record<Variant, gsap.TweenVars> = {
  up:    { y: 42,  autoAlpha: 0 },
  left:  { x: -56, autoAlpha: 0 },
  right: { x: 56,  autoAlpha: 0 },
  scale: { scale: 0.9, autoAlpha: 0 },
};

/**
 * Luxury scroll-reveal powered by GSAP ScrollTrigger.
 *
 * Why GSAP (not a bare IntersectionObserver + CSS class): ScrollTrigger is wired
 * into the same Lenis raf loop (see use-lenis.ts), recalculates positions on
 * refresh, and therefore reveals reliably even when the page is reloaded while
 * already scrolled down — fixing the "content vanishes on refresh" problem.
 *
 * A viewport failsafe guarantees content is never left permanently invisible.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className,
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show immediately, no animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, fromVars[variant]);
      gsap.to(el, {
        x: 0, y: 0, scale: 1, autoAlpha: 1,
        duration: 1.05,
        delay: delay / 1000,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: !repeat,
          toggleActions: repeat
            ? "play reverse play reverse"
            : "play none none none",
        },
      });
    }, el);

    // Failsafe: if the element is in the viewport but ScrollTrigger hasn't
    // revealed it within 1.2s (e.g. a scroll-restoration race on reload),
    // force it visible. Never touches genuinely off-screen elements.
    const failsafe = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (inView && parseFloat(getComputedStyle(el).opacity) < 0.05) {
        gsap.to(el, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
      }
    }, 1200);

    return () => { clearTimeout(failsafe); ctx.revert(); };
  }, [variant, delay, repeat]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
