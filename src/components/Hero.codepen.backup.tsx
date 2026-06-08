import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Renders a word as per-letter spans for GSAP reveal
function LetterWord({
  word,
  wordColor,
}: {
  word: string;
  wordColor?: string;
}) {
  return (
    <div
      className="flex justify-center"
      style={{ overflow: "hidden", lineHeight: 0.88 }}
    >
      {word.split("").map((char, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={{ whiteSpace: "pre", ...(wordColor ? { color: wordColor } : {}) }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Bebas Neue', 'DM Serif Display', serif",
  fontSize: "clamp(3rem, 18vw, 230px)",
  fontWeight: 400,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
  lineHeight: 0.88,
  margin: 0,
  userSelect: "none",
};

export default function Hero() {
  const sectionRef        = useRef<HTMLElement>(null);
  const videoRef          = useRef<HTMLVideoElement>(null);
  const contentRef        = useRef<HTMLDivElement>(null);
  const textGroupRef      = useRef<HTMLDivElement>(null);
  const solidTitleRef     = useRef<HTMLHeadingElement>(null);
  const strokeTitleRef    = useRef<HTMLDivElement>(null);
  const cursorRef         = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Per-letter entry animation ── */
  useLayoutEffect(() => {
    const solid  = solidTitleRef.current?.querySelectorAll<HTMLElement>(".hero-letter");
    const stroke = strokeTitleRef.current?.querySelectorAll<HTMLElement>(".hero-letter");
    if (!solid?.length || !stroke?.length) return;

    const params = {
      duration: 1.5,
      y: "0%",
      scale: 1,
      ease: "expo.inOut",
      delay: 0.65,
      stagger: 0.022,
    };

    gsap.set([...solid, ...stroke], { y: "120%", scale: -0.5 });
    gsap.to([...solid], params);
    gsap.to([...stroke], params);
  }, []);

  /* ── Scroll parallax ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scale: 1.13,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2.2,
        },
      });
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "12% top",
          end: "55% top",
          scrub: 1.8,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── Mouse parallax on text ── */
  useEffect(() => {
    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      if (textGroupRef.current)
        textGroupRef.current.style.transform = `translate(${cx * -12}px,${cy * -7}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("mousemove", onMove); };
  }, []);

  /* ── Custom circular cursor ── */
  useEffect(() => {
    const cursor  = cursorRef.current;
    const section = sectionRef.current;
    if (!cursor || !section) return;

    const onMove  = (e: MouseEvent) =>
      gsap.to(cursor, { duration: 0.4, x: e.clientX, y: e.clientY, ease: "power2.out" });
    const onEnter = () =>
      gsap.to(cursor, { scale: 1, duration: 0.5, ease: "expo.inOut" });
    const onLeave = () =>
      gsap.to(cursor, { scale: 0, duration: 0.5, ease: "expo.inOut" });

    section.addEventListener("mousemove",  onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove",  onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Floating dust particles (cream on dark) ── */
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.10,
      vy: -(Math.random() * 0.12 + 0.03),
      at: Math.random() * 0.10 + 0.03,
      a: 0, life: Math.random() * 400, maxLife: 400 + Math.random() * 250,
    }));

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0; p.x = Math.random() * W; p.y = H + 8;
          p.vx = (Math.random() - 0.5) * 0.10; p.vy = -(Math.random() * 0.12 + 0.03);
          p.at = Math.random() * 0.10 + 0.03; p.a = 0;
        }
        const f = p.life / p.maxLife;
        p.a = f < 0.15 ? p.at * (f / 0.15) : f > 0.82 ? p.at * ((1 - f) / 0.18) : p.at;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,220,200,${p.a})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: 560, background: "#0D0907" }}
    >
      {/* ── Background video ── */}
      <video
        ref={videoRef}
        src="/bg.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transformOrigin: "center center" }}
      />

      {/* ── Dark cinematic overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg,rgba(13,9,7,0.82) 0%,rgba(13,9,7,0.38) 45%,rgba(13,9,7,0.72) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── SVG clip-path shape definition ── */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="heroClipPath" clipPathUnits="objectBoundingBox">
            <path d="M0.648438 0.00390625 L0.296875 0.00390625 L0.0976562 0.15625 L-0.00390625 1.003906 L0.644531 1.003906 L0.820312 0.882812 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Parallelogram video clip — desktop only ── */}
      <figure
        aria-hidden="true"
        className="hidden lg:block"
        style={{
          position: "absolute",
          zIndex: 2,
          top: "50%",
          left: "60%",
          width: "38vw",
          aspectRatio: "1 / 1",
          margin: 0,
          padding: 0,
          transform: "translate(-50%, -50%)",
          clipPath: "url(#heroClipPath)",
          pointerEvents: "none",
        }}
      >
        <video
          src="/bg.mp4"
          autoPlay muted loop playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Subtle gold wash over the clip */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(190,146,52,0.10)",
            mixBlendMode: "overlay",
          }}
        />
      </figure>

      {/* ── Floating particles ── */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      />

      {/* ── Architectural inset frame ── */}
      <div
        className="pointer-events-none absolute inset-5 sm:inset-7 border"
        style={{ borderColor: "rgba(252,250,245,0.09)", zIndex: 4 }}
      />

      {/* ── Cinematic top vignette ── */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(13,9,7,0.55) 0%, transparent 100%)",
          zIndex: 4,
        }}
      />

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative h-full flex flex-col items-center justify-center px-4 text-center"
        style={{ zIndex: 10 }}
      >
        {/* Brand eyebrow */}
        <span
          className="block font-body text-[0.6rem] sm:text-[0.63rem] tracking-[0.35em] uppercase mb-8 sm:mb-10 opacity-0 animate-fade-in"
          style={{ color: "rgba(232,220,200,0.45)", animationDelay: "400ms" }}
        >
          SV Developers &amp; Constructions · Est. 2013
        </span>

        {/* ── Title block with mouse parallax ── */}
        <div
          ref={textGroupRef}
          className="relative will-change-transform"
          style={{ width: "100%" }}
        >
          {/* Solid title */}
          <h1
            ref={solidTitleRef}
            style={{ ...TITLE_STYLE, color: "#FCFAF5", position: "relative", zIndex: 1 }}
          >
            <LetterWord word="BUILDING"    wordColor="#FCFAF5" />
            <LetterWord word="EXCELLENCE." wordColor="#BE9234" />
          </h1>

          {/* Stroke (ghost) title — overlaid at z-index 3 */}
          <div
            ref={strokeTitleRef}
            aria-hidden="true"
            style={{
              ...TITLE_STYLE,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              color: "transparent",
              WebkitTextStroke: "1px rgba(190,146,52,0.30)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <LetterWord word="BUILDING"    />
            <LetterWord word="EXCELLENCE." />
          </div>
        </div>

        {/* Gold divider */}
        <div
          className="w-10 sm:w-14 h-px my-8 sm:my-10 opacity-0 animate-fade-in"
          style={{ background: "rgba(190,146,52,0.55)", animationDelay: "1650ms" }}
        />

        {/* Tagline */}
        <p
          className="font-libre text-sm sm:text-base max-w-xs sm:max-w-sm leading-relaxed mb-10 opacity-0 animate-fade-in"
          style={{ color: "rgba(232,220,200,0.55)", animationDelay: "1800ms" }}
        >
          Crafting landmark spaces across Bengaluru and Andhra Pradesh since 2013.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 animate-fade-in w-full sm:w-auto"
          style={{ animationDelay: "2000ms" }}
        >
          <a
            href="/#work"
            className="btn-fill px-8 sm:px-10 py-3.5 font-body font-medium text-[0.7rem] tracking-[0.18em] uppercase text-center"
            style={{ background: "#BE9234", color: "#0D0907" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#D9B45E"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#BE9234"; }}
          >
            View Our Work
          </a>
          <a
            href="/#contact"
            className="px-8 sm:px-10 py-3.5 font-body text-[0.7rem] tracking-[0.18em] uppercase text-center transition-all duration-500"
            style={{ border: "1px solid rgba(252,250,245,0.22)", color: "rgba(232,220,200,0.70)" }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(252,250,245,0.08)";
              el.style.borderColor = "rgba(252,250,245,0.50)";
              el.style.color = "#FCFAF5";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "";
              el.style.borderColor = "rgba(252,250,245,0.22)";
              el.style.color = "rgba(232,220,200,0.70)";
            }}
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* ── "2013" watermark ── */}
      <div
        className="absolute bottom-8 left-7 sm:left-10 hidden sm:block opacity-0 animate-fade-in"
        style={{ animationDelay: "2300ms", zIndex: 20 }}
      >
        <span
          className="font-heading text-6xl leading-none select-none"
          style={{ color: "rgba(252,250,245,0.07)" }}
        >
          2013
        </span>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: "2500ms", zIndex: 20 }}
      >
        <span
          className="font-body text-[0.57rem] tracking-[0.28em] uppercase"
          style={{ color: "rgba(232,220,200,0.32)" }}
        >
          Scroll
        </span>
        {/* Animated chevron arrow */}
        <div
          className="animate-bounce"
          style={{
            width: 14,
            height: 14,
            borderRight: "1px solid rgba(232,220,200,0.28)",
            borderBottom: "1px solid rgba(232,220,200,0.28)",
            transform: "rotate(45deg) translate(-3px,-3px)",
            animationDuration: "2.5s",
          }}
        />
      </div>

      {/* ── Location label ── */}
      <div
        className="absolute bottom-9 right-7 sm:right-10 hidden lg:block opacity-0 animate-fade-in"
        style={{ animationDelay: "2300ms", zIndex: 20 }}
      >
        <p
          className="font-body text-[0.57rem] tracking-[0.28em] uppercase"
          style={{ color: "rgba(232,220,200,0.22)" }}
        >
          Bengaluru, India
        </p>
      </div>

      {/* ── Circular custom cursor (desktop only) ── */}
      <div
        ref={cursorRef}
        className="hidden lg:flex items-center justify-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(190,146,52,0.92)",
          color: "#0D0907",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          pointerEvents: "none",
          transform: "translate(-50%, -50%) scale(0)",
          zIndex: 1000,
        }}
      >
        Explore
      </div>
    </section>
  );
}
