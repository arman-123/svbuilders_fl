/**
 * Animated ambient-light fluid background.
 *
 * Three slow-moving radial-gradient blobs (warm charcoal → amber) drift
 * through the canvas in organic Lissajous paths. A fourth blob tracks the
 * mouse position for interactivity.
 *
 * Canvas2D — no WebGL context used, so no browser context-limit concerns.
 */
import { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    const sync = () => {
      W = container.offsetWidth;
      H = container.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);

    /* mouse (viewport-normalised, y from top) */
    let mx = 0.5, my = 0.5, mActive = false;
    let tmx = 0.5, tmy = 0.5; // lerped mouse

    const updatePos = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect();
      mx = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      my = Math.max(0, Math.min(1, (clientY - r.top)  / r.height));
      mActive = true;
    };

    const onMove  = (e: MouseEvent) => updatePos(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => updatePos(e.touches[0].clientX, e.touches[0].clientY);
    const onLeave = () => { mActive = false; };

    container.addEventListener("mousemove",  onMove);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchmove",  onTouch, { passive: true });
    container.addEventListener("touchend",   onLeave, { passive: true });

    /* draw */
    let rafId = 0;

    const draw = () => {
      const t = performance.now() / 1000;

      /* smooth mouse */
      tmx += (mx - tmx) * 0.04;
      tmy += (my - tmy) * 0.04;

      /* clear — warm beige base */
      ctx.fillStyle = "#FCFAF5";
      ctx.fillRect(0, 0, W, H);

      type Blob = { x: number; y: number; r: number; a: number; rgb: string };

      /* blob paths — Lissajous + slow drift */
      /* Warm-beige blobs: slightly darker tan shades on the beige base */
      const blobs: Blob[] = [
        {
          x: 0.22 + Math.sin(t * 0.18) * 0.14 + Math.cos(t * 0.11) * 0.06,
          y: 0.38 + Math.cos(t * 0.14) * 0.20 + Math.sin(t * 0.09) * 0.06,
          r: 0.58, a: 0.18, rgb: "160,115,65",
        },
        {
          x: 0.78 + Math.cos(t * 0.22) * 0.12 + Math.sin(t * 0.16) * 0.05,
          y: 0.62 + Math.sin(t * 0.19) * 0.16 + Math.cos(t * 0.12) * 0.05,
          r: 0.50, a: 0.13, rgb: "140,98,52",
        },
        {
          x: 0.50 + Math.sin(t * 0.13 + 2.1) * 0.22 + Math.cos(t * 0.08) * 0.06,
          y: 0.22 + Math.cos(t * 0.25 + 1.3) * 0.18 + Math.sin(t * 0.17) * 0.05,
          r: 0.44, a: 0.10, rgb: "180,138,80",
        },
        /* mouse-reactive warm glow */
        {
          x: tmx,
          y: tmy,
          r: 0.28,
          a: mActive ? 0.16 : 0.0,
          rgb: "196,149,60",
        },
      ];

      blobs.forEach(({ x, y, r, a, rgb }) => {
        if (a <= 0) return;
        const cx = x * W;
        const cy = y * H;
        const rad = Math.max(W, H) * r;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0,   `rgba(${rgb},${a})`);
        g.addColorStop(0.45,`rgba(${rgb},${a * 0.55})`);
        g.addColorStop(0.78,`rgba(${rgb},${a * 0.18})`);
        g.addColorStop(1,   `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      /* subtle warm horizontal streaks */
      const rayY1 = (0.32 + Math.sin(t * 0.12) * 0.08) * H;
      const rayY2 = (0.68 + Math.cos(t * 0.10) * 0.07) * H;
      [rayY1, rayY2].forEach((ry) => {
        const rg = ctx.createLinearGradient(0, ry - 60, 0, ry + 60);
        rg.addColorStop(0,   "rgba(160,115,65,0)");
        rg.addColorStop(0.5, "rgba(160,115,65,0.06)");
        rg.addColorStop(1,   "rgba(160,115,65,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, ry - 60, W, 120);
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener("mousemove",  onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchmove",  onTouch);
      container.removeEventListener("touchend",   onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}
