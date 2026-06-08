import { useEffect, useRef, useState } from "react";
import { Building2, Users, Trophy, TrendingUp } from "lucide-react";
import Reveal from "@/components/Reveal";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

const stats = [
  { icon: Building2, target: 7,    suffix: "",  label: "Apartment Projects"  },
  { icon: Users,     target: 6,    suffix: "",  label: "Residential Layouts" },
  { icon: Trophy,    target: 12,   suffix: "+", label: "Years Experience"    },
  { icon: TrendingUp,target: 2013, suffix: "",  label: "Established"         },
];

function StatItem({ stat, active }: { stat: (typeof stats)[0]; active: boolean }) {
  const value = useCountUp(stat.target, active);
  return (
    <div className="group">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 border border-[#473727]/25 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#473727] group-hover:border-[#473727] transition-all duration-500">
          <stat.icon className="w-4 h-4 text-[#473727] group-hover:text-[#E8DCC8] transition-colors duration-500" />
        </div>
        <div>
          <p className="font-heading text-4xl sm:text-5xl text-[#0f0d0a] leading-none tabular-nums" style={{ fontWeight: 700 }}>
            {value}
            <span style={{ color: "#BE9234" }}>{stat.suffix}</span>
          </p>
          <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[#473727] mt-1.5 font-body" style={{ fontWeight: 600, opacity: 0.85 }}>
            {stat.label}
          </p>
        </div>
      </div>
    </div>
  );
}

const completedProjects = [
  { name: "DS Paradise",            href: "/projects?cat=economical&project=6" },
  { name: "GS Exotica",             href: "/projects?cat=economical&project=7" },
  { name: "SV Aralia",              href: "/projects?cat=mid-range&project=4"  },
  { name: "SLV Greens",             href: "/projects?cat=mid-range&project=5"  },
  { name: "Gopala Grand Residency", href: "/projects?cat=luxury&project=1"     },
  { name: "VC Royale",              href: "/projects?cat=luxury&project=2"     },
  { name: "Sree Lakshmi Nilayam",   href: "/projects?cat=luxury&project=3"     },
];

const values = ["Quality Construction","Transparency","Trust & Integrity","Timely Delivery","Customer Focus","Innovation"];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);
  const [visible,  setVisible]  = useState(false);

  /* ── Parallax background ── */
  useEffect(() => {
    const section = sectionRef.current;
    const bg      = bgRef.current;
    if (!section || !bg) return;
    const onScroll = () => {
      const rect     = section.getBoundingClientRect();
      const vh       = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped  = Math.max(0, Math.min(1, progress));
      bg.style.transform = `translateY(${(clamped - 0.5) * -52}px) scale(1.07)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Entrance trigger ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setCounting(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ease = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* ── Parallax background ── */}
      <div
        ref={bgRef}
        className="absolute bg-cover bg-center will-change-transform"
        style={{ backgroundImage: "url('/bg2.jpg')", top: "-7%", bottom: "-7%", left: 0, right: 0 }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(205,192,173,0.83)" }} />
      </div>

      {/* ── Watermark ── */}
      <span
        className="pointer-events-none absolute -top-4 right-0 font-heading leading-none select-none"
        style={{ fontSize: "22vw", color: "rgba(71,55,39,0.032)", zIndex: 1 }}
      >
        SV
      </span>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">

          {/* ── Heading ── */}
          <div className="mb-12">
            <p
              className="section-label font-body mb-4"
              style={{
                color: "rgba(71,55,39,0.88)",
                opacity:   visible ? 1 : 0,
                transform: visible ? "none" : "translateY(18px)",
                transition: `opacity 0.7s ease, transform 0.7s ${ease}`,
              }}
            >
              Who We Are
            </p>

            <h2 style={{ lineHeight: 1.0, margin: "0 0 1.5rem" }}>
              <div style={{ overflow: "hidden" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading, 'DM Serif Display', serif)",
                    fontSize: "clamp(3rem, 7vw, 6.5rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "#0f0d0a",
                    transform: visible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform 1.05s ${ease} 80ms`,
                  }}
                >
                  About SV
                </span>
              </div>
              <div style={{ overflow: "hidden" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading, 'DM Serif Display', serif)",
                    fontSize: "clamp(3rem, 7vw, 6.5rem)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    letterSpacing: "-0.025em",
                    color: "#BE9234",
                    transform: visible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform 1.05s ${ease} 260ms`,
                  }}
                >
                  Developers
                </span>
              </div>
            </h2>

            {/* Animated wave rule */}
            <svg width="220" height="22" viewBox="0 0 220 22" fill="none" style={{ display: "block" }}>
              <path
                pathLength="1"
                d="M0,11 C27.5,0 55,22 82.5,11 C110,0 137.5,22 165,11 C192.5,0 220,22 220,11"
                stroke="rgba(190,146,52,0.50)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: "1",
                  strokeDashoffset: visible ? "0" : "1",
                  transition: `stroke-dashoffset 1.7s ${ease} 680ms`,
                }}
              />
            </svg>
          </div>

          {/* ── Body copy ── */}
          <Reveal delay={80}>
            <div
              className="space-y-5 font-libre leading-[1.85] max-w-2xl mb-14"
              style={{ color: "#2a2018", fontSize: "1.05rem" }}
            >
              <p>
                <span style={{ fontWeight: 700, color: "#0f0d0a" }}>Established in 2013</span>, SV Developers &amp; Constructions has grown into a respected name in real estate and construction across Andhra Pradesh and Karnataka.
              </p>
              <p>
                We specialize in residential development, land layouts, and premium construction — having completed{" "}
                <span style={{ fontWeight: 700, color: "#0f0d0a" }}>7 apartment projects</span> and{" "}
                <span style={{ fontWeight: 700, color: "#0f0d0a" }}>6 residential layouts</span>. Each project reflects our core values: quality, transparency, trust, and timely delivery.
              </p>
            </div>
          </Reveal>

          {/* ── Stats — individually staggered ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-t border-b border-[#473727]/15 mb-14">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={160 + i * 75}>
                <StatItem stat={stat} active={counting} />
              </Reveal>
            ))}
          </div>

          {/* ── Projects + Values ── */}
          <div className="grid sm:grid-cols-2 gap-12 lg:gap-20">

            <Reveal delay={200}>
              <div>
                {/* Section eyebrow */}
                <p className="section-label font-body mb-3" style={{ color: "rgba(71,55,39,0.88)" }}>
                  Our Portfolio
                </p>

                {/* Prominent heading */}
                <div style={{ marginBottom: "1.4rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading, 'DM Serif Display', serif)",
                      fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.022em",
                      lineHeight: 1.1,
                      color: "#0f0d0a",
                      marginBottom: "0.7rem",
                    }}
                  >
                    
                    <span style={{ fontStyle: "italic", fontWeight: 400, color: "#0f0d0a" }}>
                     COMPLETED APARTMENT PROJECTS                    </span>
                  </h3>
                  <div style={{ width: 36, height: 2, background: "linear-gradient(to right, #BE9234, rgba(190,146,52,0.3))", borderRadius: 2 }} />
                </div>

                {/* Project rows — clickable */}
                <div>
                  {completedProjects.map((proj, i) => (
                    <a
                      key={proj.name}
                      href={proj.href}
                      className="flex items-center justify-between py-3"
                      style={{
                        borderBottom: "1px solid rgba(71,55,39,0.10)",
                        textDecoration: "none",
                        opacity: counting ? 1 : 0,
                        transform: counting ? "translateX(0)" : "translateX(-20px)",
                        transition: `opacity 0.55s ease ${300 + i * 65}ms, transform 0.55s ${ease} ${300 + i * 65}ms, border-color 0.3s ease`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderBottomColor = "rgba(190,146,52,0.45)";
                        const arrow = el.querySelector(".proj-arrow") as HTMLElement;
                        if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateX(0)"; }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderBottomColor = "rgba(71,55,39,0.10)";
                        const arrow = el.querySelector(".proj-arrow") as HTMLElement;
                        if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateX(-6px)"; }
                      }}
                      onTouchStart={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderBottomColor = "rgba(190,146,52,0.45)";
                        const arrow = el.querySelector(".proj-arrow") as HTMLElement;
                        if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateX(0)"; }
                      }}
                      onTouchEnd={e => {
                        const el = e.currentTarget as HTMLElement;
                        setTimeout(() => {
                          el.style.borderBottomColor = "rgba(71,55,39,0.10)";
                          const arrow = el.querySelector(".proj-arrow") as HTMLElement;
                          if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateX(-6px)"; }
                        }, 400);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-body"
                          style={{ fontSize: "0.6rem", color: "rgba(190,146,52,0.70)", fontWeight: 600, letterSpacing: "0.12em", minWidth: 20 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-libre"
                          style={{ fontSize: "clamp(0.88rem, 1.2vw, 1.02rem)", fontWeight: 600, color: "#1a140e" }}
                        >
                          {proj.name}
                        </span>
                      </div>
                      <span
                        className="proj-arrow font-body"
                        style={{
                          fontSize: "0.78rem",
                          color: "#BE9234",
                          opacity: 0,
                          transform: "translateX(-6px)",
                          transition: "opacity 0.28s ease, transform 0.28s ease",
                        }}
                      >
                        →
                      </span>
                    </a>
                  ))}
                </div>

                {/* View all CTA */}
                <a
                  href="/projects"
                  className="font-body inline-flex items-center gap-2 mt-5"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#473727",
                    textDecoration: "none",
                    opacity: counting ? 1 : 0,
                    transition: `opacity 0.5s ease ${300 + completedProjects.length * 65 + 100}ms`,
                  }}
                  onMouseEnter={e => {
                    const line = (e.currentTarget as HTMLElement).querySelector(".cta-line") as HTMLElement;
                    if (line) line.style.width = "36px";
                  }}
                  onMouseLeave={e => {
                    const line = (e.currentTarget as HTMLElement).querySelector(".cta-line") as HTMLElement;
                    if (line) line.style.width = "22px";
                  }}
                  onTouchStart={e => {
                    const line = (e.currentTarget as HTMLElement).querySelector(".cta-line") as HTMLElement;
                    if (line) line.style.width = "36px";
                  }}
                  onTouchEnd={e => {
                    const el = e.currentTarget as HTMLElement;
                    setTimeout(() => {
                      const line = el.querySelector(".cta-line") as HTMLElement;
                      if (line) line.style.width = "22px";
                    }, 400);
                  }}
                >
                  <span
                    className="cta-line"
                    style={{ display: "inline-block", width: 22, height: 1, background: "#BE9234", transition: "width 0.35s ease", flexShrink: 0 }}
                  />
                  View All Projects
                </a>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div>
                <p className="section-label font-body mb-5" style={{ color: "rgba(71,55,39,0.88)" }}>
                  Our Values
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((v, i) => (
                    <span
                      key={v}
                      className="px-3.5 py-1.5 text-[0.65rem] tracking-[0.16em] uppercase font-body hover:bg-[#473727] hover:text-[#E8DCC8] hover:border-[#473727]"
                      style={{
                        border: "1px solid rgba(71,55,39,0.38)",
                        color: "#473727",
                        fontWeight: 600,
                        opacity: counting ? 1 : 0,
                        transform: counting ? "translateY(0)" : "translateY(14px)",
                        transition: `opacity 0.5s ease ${400 + i * 75}ms, transform 0.5s ${ease} ${400 + i * 75}ms, background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease`,
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </div>
    </section>
  );
}
