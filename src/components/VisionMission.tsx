import { useRef, useEffect, useState } from "react";

const BROWN = "#473727";
const GOLD  = "#BE9234";

export default function VisionMission() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fadeUp = (delay: string): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.9s ease ${delay}, transform 0.9s ease ${delay}`,
  });

  return (
    <section ref={sectionRef} id="vision" className="relative bg-[#FCFAF5] overflow-hidden">

      {/* Watermark */}
      <span className="pointer-events-none select-none absolute -bottom-6 right-0 font-heading text-[22vw] leading-none text-[#473727]/[0.04]">
        SV
      </span>

      <div className="grid lg:grid-cols-2 min-h-[680px]">

        {/* ── Left — image ── */}
        <div className="relative overflow-hidden min-h-[320px] lg:min-h-0 order-last lg:order-first">
          <img
            src="/vision.png"
            alt="SV Developers — Vision"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? "scale(1)" : "scale(1.06)",
              transition: "opacity 1.4s ease, transform 1.4s ease",
              filter: "sepia(0.1) brightness(0.94)",
            }}
          />
          {/* Feather right edge into cream */}
          <div
            className="absolute inset-0 hidden lg:block"
            style={{ background: "linear-gradient(to right, transparent 52%, #FCFAF5 100%)" }}
          />
          {/* Feather bottom edge on mobile */}
          <div
            className="absolute inset-0 block lg:hidden"
            style={{ background: "linear-gradient(to bottom, transparent 55%, #FCFAF5 100%)" }}
          />
          {/* Subtle warm tint */}
          <div className="absolute inset-0" style={{ background: "rgba(71,55,39,0.06)" }} />
        </div>

        {/* ── Right — text ── */}
        <div className="relative px-6 sm:px-10 lg:px-16 xl:px-20 py-20 sm:py-24 lg:py-28 flex flex-col justify-center z-10">

          {/* Label */}
          <div style={fadeUp("0.1s")}>
            <p
              className="font-body mb-8"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
              }}
            >
              SV Developers
            </p>
          </div>

          {/* Section heading */}
          <div style={fadeUp("0.2s")}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                color: BROWN,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                margin: "0 0 2.5rem",
              }}
            >
              Our Purpose
            </h2>
          </div>

          {/* Mission */}
          <div style={fadeUp("0.35s")}>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-6 h-px flex-shrink-0" style={{ background: GOLD }} />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                  fontWeight: 700,
                  color: BROWN,
                  margin: 0,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Mission
              </h3>
            </div>
            <p
              className="font-libre"
              style={{
                color: `${BROWN}99`,
                fontSize: "clamp(0.93rem, 1.1vw, 1.02rem)",
                lineHeight: 1.9,
                maxWidth: "54ch",
              }}
            >
              At SV Developers, our mission is to craft beautiful, thoughtfully designed homes that bring the dream of luxury living within reach of every family. We believe that elegance is not a privilege but a standard every family deserves. Through quality construction, inspired design and an unwavering commitment to our communities, we build more than homes; we build a life worth living.
            </p>
          </div>

          {/* Divider */}
          <div
            className="my-9"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.9s ease 0.5s",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: `${BROWN}12` }} />
              <div
                className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
                style={{ background: GOLD, opacity: 0.6 }}
              />
              <div className="flex-1 h-px" style={{ background: `${BROWN}12` }} />
            </div>
          </div>

          {/* Vision */}
          <div style={fadeUp("0.55s")}>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-6 h-px flex-shrink-0" style={{ background: GOLD }} />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                  fontWeight: 700,
                  color: BROWN,
                  margin: 0,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Vision
              </h3>
            </div>
            <p
              className="font-libre"
              style={{
                color: `${BROWN}99`,
                fontSize: "clamp(0.93rem, 1.1vw, 1.02rem)",
                lineHeight: 1.9,
                maxWidth: "54ch",
              }}
            >
              Our vision is a world where every family, regardless of background, has the opportunity to experience the comfort, beauty and pride that comes with calling a truly exceptional home their own. SV Developers strives to be the builder that bridges aspiration and reality, creating spaces where generations flourish and memories are made.
            </p>
          </div>

          {/* Est. tag */}
          <div
            className="mt-10"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 0.8s",
            }}
          >
            <p
              className="font-body"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: `${BROWN}40`,
                fontWeight: 600,
              }}
            >
              Est. 2013 &nbsp;·&nbsp; Bengaluru
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
