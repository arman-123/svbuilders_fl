/**
 * 3-D sphere cursor rendered in Canvas2D.
 *
 * Technique: offset radial gradient (body depth) + clipped specular
 * highlight + Fresnel rim — creates a convincing glass-ball appearance
 * without WebGL. Velocity deforms the sphere into an elongated teardrop.
 * Eight previous positions fade as a luminous mercury trail.
 *
 * Desktop / fine-pointer only.
 */
import { useEffect, useRef } from "react";

/* ── canvas-based sphere drawing ─────────────────────────────────────────── */
function drawSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  vx: number,
  vy: number,
  hover: boolean
) {
  const speed = Math.sqrt(vx * vx + vy * vy);
  const angle = Math.atan2(vy, vx);
  const stretch = hover ? 1 : Math.min(1 + speed * 0.065, 2.0);
  const squish  = hover ? 1 : Math.max(1 / stretch, 0.44);

  /* ── transform for velocity deformation ── */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(stretch, squish);
  ctx.rotate(-angle);

  /* outer atmospheric glow */
  const gGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
  gGlow.addColorStop(0,   "rgba(232,220,200,0.16)");
  gGlow.addColorStop(0.5, "rgba(232,220,200,0.06)");
  gGlow.addColorStop(1,   "rgba(232,220,200,0)");
  ctx.beginPath();
  ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = gGlow;
  ctx.fill();

  /* main body — offset gradient mimics light from top-left */
  const ox = -r * 0.32, oy = -r * 0.32;
  const gBody = ctx.createRadialGradient(ox, oy, 0, 0, 0, r);
  gBody.addColorStop(0,    "rgba(255,253,248,0.92)");
  gBody.addColorStop(0.38, "rgba(232,220,200,0.60)");
  gBody.addColorStop(0.75, "rgba(160,138,108,0.28)");
  gBody.addColorStop(1,    "rgba(71,55,39,0.04)");
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = gBody;
  ctx.fill();

  /* specular highlight — clipped to sphere */
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();
  const sx = ox * 0.75, sy = oy * 0.75;
  const gSpec = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.32);
  gSpec.addColorStop(0, "rgba(255,255,255,0.96)");
  gSpec.addColorStop(0.5, "rgba(255,255,255,0.30)");
  gSpec.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = gSpec;
  ctx.fillRect(-r, -r, r * 2, r * 2);
  ctx.restore();

  /* Fresnel rim */
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(232,220,200,0.42)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();

  /* crisp centre dot (outside deform transform) */
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();
}

/* ── trail dots ──────────────────────────────────────────────────────────── */
function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: { x: number; y: number }[]
) {
  trail.forEach(({ x, y }, i) => {
    const t = 1 - i / trail.length;          // 1 = freshest
    const tr = 7 * t;
    const g = ctx.createRadialGradient(x, y, 0, x, y, tr);
    g.addColorStop(0, `rgba(232,220,200,${t * 0.32})`);
    g.addColorStop(1, "rgba(232,220,200,0)");
    ctx.beginPath();
    ctx.arc(x, y, tr, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  });
}

/* ── component ───────────────────────────────────────────────────────────── */
export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    document.documentElement.classList.add("lux-cursor-enabled");

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    /* resize canvas to fill viewport */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = -300, my = -300;
    let cx = mx,   cy = my;     // lerped main
    let tx = mx,   ty = my;     // lerped trail head
    let vx = 0,    vy = 0;
    let hover   = false;
    let visible = false;
    let rafId   = 0;

    const TRAIL_LEN = 8;
    const trail: { x: number; y: number }[] = [];

    const onMove = (e: MouseEvent) => {
      vx = e.clientX - mx;
      vy = e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      if (!visible) { visible = true; }
    };

    let trailTick = 0;

    const render = () => {
      /* lerp */
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      tx += (mx - tx) * 0.07;
      ty += (my - ty) * 0.07;

      /* sample trail every 2 frames */
      trailTick++;
      if (trailTick % 2 === 0) {
        trail.unshift({ x: tx, y: ty });
        if (trail.length > TRAIL_LEN) trail.pop();
      }

      /* decay velocity */
      vx *= 0.76;
      vy *= 0.76;

      /* clear and draw */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (visible) {
        const r = hover ? 36 : 22;
        drawTrail(ctx, trail);
        drawSphere(ctx, cx, cy, r, vx, vy, hover);
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    /* hover expand / contract */
    const interactiveSel = 'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';
    const onOver = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactiveSel)) hover = true;
    };
    const onOut = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactiveSel)) hover = false;
    };

    /* magnetic buttons */
    const magCleanups: (() => void)[] = [];
    const setupMagnetic = () => {
      document.querySelectorAll<HTMLElement>(
        ".btn-fill:not([data-mag-init]), [data-magnetic]:not([data-mag-init])"
      ).forEach((el) => {
        el.dataset.magInit = "1";
        const onMagMove = (e: MouseEvent) => {
          const r   = el.getBoundingClientRect();
          const dx  = e.clientX - (r.left + r.width / 2);
          const dy  = e.clientY - (r.top  + r.height / 2);
          const d   = Math.sqrt(dx * dx + dy * dy);
          const rad = Math.max(r.width, r.height) * 0.9;
          if (d < rad) {
            const pull = (1 - d / rad) * 0.32;
            el.style.transform  = `translate(${dx * pull}px, ${dy * pull}px)`;
            el.style.transition = "transform 0.12s ease";
          }
        };
        const onMagLeave = () => {
          el.style.transform  = "";
          el.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
        };
        el.addEventListener("mousemove",  onMagMove);
        el.addEventListener("mouseleave", onMagLeave);
        magCleanups.push(() => {
          el.removeEventListener("mousemove",  onMagMove);
          el.removeEventListener("mouseleave", onMagLeave);
        });
      });
    };
    setupMagnetic();
    const magTimer = setInterval(setupMagnetic, 1800);

    window.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(magTimer);
      magCleanups.forEach((fn) => fn());
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.documentElement.classList.remove("lux-cursor-enabled");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
