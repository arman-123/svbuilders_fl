import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const GOLD = "#BE9234";
const CREAM = "#E8DCC8";
const ease = "cubic-bezier(0.16,1,0.3,1)";

/**
 * Home-page feature band for the ongoing project "The Aurora".
 * Sits between the Hero and About sections and links to the dedicated
 * /aurora showcase page.
 */
export default function AuroraFeature() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#0f0d0a" }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(15,13,10,0.92) 0%, rgba(15,13,10,0.7) 55%, rgba(15,13,10,0.4) 100%)" }} />

      <div className="relative container mx-auto px-5 sm:px-8 lg:px-10 py-24 sm:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="section-label font-body mb-5" style={{ color: "rgba(232,220,200,0.85)" }}>
              Now Pre-Launching · Hoskote, Bangalore
            </p>
            <h2 style={{ margin: "0 0 1.25rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(2.8rem,7vw,6rem)", fontWeight: 700, letterSpacing: "-0.02em",
                  lineHeight: 1, color: CREAM, display: "block",
                }}
              >
                The Aurora
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.3rem,3vw,2.2rem)", fontWeight: 400, fontStyle: "italic",
                  letterSpacing: "-0.01em", color: GOLD, display: "block",
                }}
              >
                Luxury Residences
              </span>
            </h2>
            <p
              className="font-libre mb-9"
              style={{ color: "rgba(232,220,200,0.82)", fontSize: "clamp(1rem,1.4vw,1.15rem)", lineHeight: 1.75 }}
            >
              A 2.1-acre masterplan with 81% open landscape, 23+ storey MIVAN-built towers and 45+ curated
              amenities — on Bangalore's fastest-appreciating eastern corridor. The project we have been
              building toward, in every sense.
            </p>

            {/* Mini figures */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 mb-10">
              {[["81%", "Open landscape"], ["45+", "Amenities"], ["23+", "Storeys"]].map(([k, v]) => (
                <div key={v}>
                  <p className="font-heading" style={{ fontSize: "1.9rem", fontWeight: 700, color: CREAM, lineHeight: 1 }}>{k}</p>
                  <p className="font-body mt-1" style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(232,220,200,0.7)", fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>

            <Link
              to="/aurora"
              className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
              style={{ background: CREAM, color: "#473727", fontWeight: 600, transition: `all 0.4s ${ease}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = "#473727"; }}
            >
              Explore The Aurora
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
