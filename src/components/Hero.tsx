import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { useGyroscope } from "@/hooks/use-gyroscope";

const STATS = [
  { num: "500+", label: "Homes Delivered" },
  { num: "12+",  label: "Years of Trust"  },
  { num: "2",    label: "States"          },
];

export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const isTouch      = useTouchDevice();

  /* ── Mouse parallax (desktop) ── */
  useEffect(() => {
    if (isTouch) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth  - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    };
    const tick = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      if (textGroupRef.current)
        textGroupRef.current.style.transform = `translate(${cx * -10}px, ${cy * -6}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("mousemove", onMove); };
  }, [isTouch]);

  /* ── Touch parallax (mobile) — finger tracking + gyro fallback ── */
  const gyroTarget = useRef({ tx: 0, ty: 0 });
  useGyroscope((x, y) => { gyroTarget.current = { tx: x, ty: y }; }, isTouch);

  useEffect(() => {
    if (!isTouch) return;
    let cx = 0, cy = 0, rafId = 0;

    // Finger tracking on touch move
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      gyroTarget.current = {
        tx: (t.clientX / window.innerWidth  - 0.5),
        ty: (t.clientY / window.innerHeight - 0.5),
      };
    };

    const tick = () => {
      cx += (gyroTarget.current.tx - cx) * 0.04;
      cy += (gyroTarget.current.ty - cy) * 0.04;
      if (textGroupRef.current)
        textGroupRef.current.style.transform = `translate(${cx * -10}px, ${cy * -6}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("touchmove", onTouch); };
  }, [isTouch]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: 600, background: "#EDE3D0" }}
    >
      {/* ── BG Video — unshaded, cinematic grade ── */}
      <video
        ref={videoRef}
        src="/bg.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 1,
          filter: "contrast(1.08) saturate(1.06) brightness(0.92)",
        }}
      />

      {/* ── Layered depth — edge vignette + central content scrim ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, transparent 55%, rgba(20,12,4,0.32) 100%),
            linear-gradient(to bottom, rgba(14,8,3,0.30) 0%, transparent 20%, transparent 65%, rgba(8,4,1,0.52) 100%)
          `,
          zIndex: 1,
        }}
      />
      {/* Soft scrim behind text — improves legibility without killing the architecture */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 68% 55% at 50% 48%, rgba(10,6,2,0.38) 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* ── Architectural frame ── */}
      <div
        className="pointer-events-none absolute inset-5 sm:inset-9 border hidden sm:block"
        style={{ borderColor: "rgba(237,220,190,0.22)", zIndex: 3 }}
      />

      {/* ── Vertical EST. label — left edge ── */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-4"
        style={{ zIndex: 10 }}
      >
        <span style={{ width: 1, height: 40, background: "rgba(237,220,190,0.30)", display: "block" }} />
        <span
          className="font-body"
          style={{
            fontSize: "0.48rem",
            letterSpacing: "0.30em",
            color: "rgba(237,220,190,0.50)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          Est. 2013
        </span>
        <span style={{ width: 1, height: 40, background: "rgba(237,220,190,0.30)", display: "block" }} />
      </div>

      {/* ── 2013 watermark ── */}
      <div
        className="pointer-events-none select-none absolute bottom-0 right-0 font-heading"
        style={{
          fontSize: "clamp(6rem, 22vw, 240px)",
          lineHeight: 1,
          color: "rgba(237,220,190,0.07)",
          zIndex: 2,
          letterSpacing: "-0.04em",
        }}
      >
        2013
      </div>

      {/* ── Bengaluru label ── */}
      <div
        className="absolute bottom-10 right-10 hidden sm:flex items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span style={{ display: "block", width: 20, height: 1, background: "rgba(237,220,190,0.35)" }} />
        <span
          className="font-body"
          style={{ fontSize: "0.50rem", letterSpacing: "0.28em", color: "rgba(237,220,190,0.55)", textTransform: "uppercase" }}
        >
          Karnataka, India
        </span>
      </div>

      {/* ── Main content ── */}
      <div
        className="relative h-full flex flex-col items-center justify-center text-center"
        style={{ zIndex: 10, padding: "0 clamp(1.5rem, 6vw, 5rem)", paddingBottom: "14vh" }}
      >
        <div ref={textGroupRef} className="will-change-transform">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-5 mb-10 animate-[fade-in_1s_ease-out_200ms_both]">
            <span style={{ display: "block", width: 32, height: 1, background: "rgba(130,88,52,0.50)" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.40em",
                textTransform: "uppercase",
                color: "#A07050",
                fontWeight: 500,
              }}
            >
              SV Developers
            </span>
            <span style={{ display: "block", width: 32, height: 1, background: "rgba(130,88,52,0.50)" }} />
          </div>

          {/* Headline */}
          <h1 style={{ lineHeight: 0.88, letterSpacing: "-0.02em", margin: 0 }}>

            {/* Line 1 — roman, per-letter wave */}
            <div style={{ display: "block", overflow: "hidden" }}>
              <div
                className="animate-[mask-up_1.1s_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: "500ms" }}
              >
                {"Building".split("").map((char, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
                      fontSize: "clamp(4rem, 10vw, 148px)",
                      fontWeight: 400,
                      fontStyle: "normal",
                      display: "inline-block",
                      letterSpacing: "-0.02em",
                      color: "#F0E8DC",
                      animation: `text-wave 3.2s ease-in-out ${1400 + i * 90}ms infinite`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Line 2 — italic, per-letter wave with offset */}
            <div style={{ display: "block", overflow: "hidden" }}>
              <div
                className="animate-[mask-up_1.1s_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: "750ms" }}
              >
                {"Excellence.".split("").map((char, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
                      fontSize: "clamp(4rem, 10vw, 148px)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      display: "inline-block",
                      letterSpacing: "-0.02em",
                      color: "#D8CCBC",
                      animation: `text-wave 3.2s ease-in-out ${1650 + i * 90}ms infinite`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </h1>

          {/* Thin rule */}
          <div
            className="animate-[fade-in_1s_ease-out_1400ms_both]"
            style={{ width: 40, height: 1, background: "rgba(200,183,163,0.30)", margin: "2.2rem auto 0" }}
          />

          {/* Tagline */}
          <p
            className="animate-[fade-in_1s_ease-out_1600ms_both] mx-auto"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "clamp(0.78rem, 1.1vw, 0.95rem)",
              maxWidth: 400,
              lineHeight: 2.1,
              color: "rgba(220,206,186,0.82)",
              marginTop: "1.4rem",
              letterSpacing: "0.06em",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Crafting landmark spaces across Karnataka<br />and Andhra Pradesh since 2013.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 sm:mt-12 animate-[fade-in_1s_ease-out_1900ms_both]">
            <a
              href="/projects"
              className="btn-fill inline-flex items-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "14px 38px",
                background: "#3A2418",
                color: "#F5EFE7",
                border: "1px solid rgba(245,239,231,0.12)",
                transition: "background 0.5s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#4D3120"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#3A2418"; }}
            >
              View Our Work
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "14px 38px",
                background: "rgba(20,12,6,0.28)",
                border: "1px solid rgba(220,206,186,0.30)",
                color: "rgba(220,206,186,0.85)",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.5s ease, color 0.5s ease, background 0.5s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(220,206,186,0.60)";
                el.style.color = "#F0E8DC";
                el.style.background = "rgba(20,12,6,0.50)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(220,206,186,0.30)";
                el.style.color = "rgba(220,206,186,0.85)";
                el.style.background = "rgba(20,12,6,0.28)";
              }}
            >
              Get In Touch
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-14 animate-[fade-in_1s_ease-out_2100ms_both]">
            {STATS.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center" style={{ position: "relative" }}>
                {i > 0 && (
                  <span
                    className="absolute -left-5 sm:-left-8 top-1/2 -translate-y-1/2"
                    style={{ width: 1, height: 28, background: "rgba(200,183,163,0.18)", display: "block" }}
                  />
                )}
                <div
                  style={{
                    fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
                    fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)",
                    color: "#EDE3D0",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    fontWeight: 400,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.24em",
                    color: "rgba(200,183,163,0.55)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginTop: "0.4rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-9 flex flex-col items-center gap-2 animate-[fade-in_1s_ease-out_2400ms_both]"
        style={{ zIndex: 20 }}
      >
        <ChevronDown
          size={16}
          style={{ color: "rgba(237,220,190,0.40)", animation: "float-slow 2.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
