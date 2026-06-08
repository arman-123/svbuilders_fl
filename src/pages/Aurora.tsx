import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Download, MapPin, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BrochureModal from "@/components/BrochureModal";

const GOLD = "#BE9234";
const BROWN = "#473727";
const CREAM = "#E8DCC8";
const ease = "cubic-bezier(0.16,1,0.3,1)";

/* Heading helper that matches the site's serif display treatment */
function Display({ children, italic, color = "#0f0d0a", size = "clamp(2.2rem,5vw,4rem)" }: {
  children: React.ReactNode; italic?: boolean; color?: string; size?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
        fontSize: size,
        fontWeight: italic ? 400 : 700,
        fontStyle: italic ? "italic" : "normal",
        letterSpacing: "-0.02em",
        lineHeight: 1.05,
        color,
        display: "block",
      }}
    >
      {children}
    </span>
  );
}

const highlights = [
  { k: "2.1 acres", v: "Masterplan" },
  { k: "81%", v: "Open / Landscape" },
  { k: "23+", v: "Storeys, MIVAN built" },
  { k: "45+", v: "Curated amenities" },
];

const residences = [
  { name: "The Belgravia", type: "2 Bedroom", area: "1200+ sq. ft.", note: "For the couple who have earned their quiet." },
  { name: "The Chelsea", type: "2 Bedroom", area: "1400+ sq. ft.", note: "The larger 2-bedroom for those who host." },
  { name: "The Windsor", type: "3 Bedroom", area: "1600+ sq. ft.", note: "A full three-bedroom home, held in proportion." },
  { name: "The Kensington", type: "3 Bedroom", area: "1800+ sq. ft.", note: "Aurora's largest. For the family that has arrived." },
];

const specs = [
  { k: "Construction", v: "MIVAN — monolithic, crack-resistant, earthquake-resilient" },
  { k: "Power", v: "24×7, 100% DG backup across common & residential load" },
  { k: "Water", v: "STP + WTP, rainwater harvesting, full recharge system" },
  { k: "Transport", v: "5 resident + 2 service lifts per tower, fire-rated" },
  { k: "Smart Ready", v: "Pre-wired for fibre, home automation & EV charging" },
  { k: "Status", v: "Pre-Launch · Heritage Edition" },
];

const locationAnchors = [
  { k: "Airport", v: "25 minutes to Kempegowda International via the STRR" },
  { k: "Metro", v: "MVJ Hospital Metro Station — under 4 minutes" },
  { k: "Bullet Train", v: "Approved station on the Chennai–Bangalore corridor" },
  { k: "Highway", v: "NH-75 on-corridor · 6-lane Chennai Express Highway" },
];

const gallery = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
];

export default function Aurora() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Subtle hero parallax */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.08)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lightbox keyboard nav */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % gallery.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <Helmet>
        <title>The Aurora — Luxury Residences | SV Developers</title>
        <meta
          name="description"
          content="The Aurora by SV Developers — luxury 2 & 3 bedroom residences on the Hoskote corridor, Bangalore. 2.1-acre masterplan, 81% open landscape, 45+ amenities, MIVAN construction. Pre-launch now."
        />
        <meta property="og:title" content="The Aurora — Luxury Residences | SV Developers" />
        <meta
          property="og:description"
          content="A quieter kind of wealth, on Hoskote highway. 23+ storey luxury residences with 45+ curated amenities."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/aurora" />
      </Helmet>

      <Header />
      <BrochureModal open={modalOpen} onClose={() => setModalOpen(false)} project="Aurora" />

      <main className="overflow-x-hidden">
        {/* ──────────────── HERO ──────────────── */}
        <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
          <div
            ref={heroRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,13,10,0.85) 0%, rgba(15,13,10,0.25) 50%, rgba(15,13,10,0.45) 100%)" }} />

          <div className="relative z-10 container mx-auto px-5 sm:px-8 lg:px-10 pb-16 sm:pb-24">
            <div className="max-w-3xl">
              <p className="section-label font-body mb-5" style={{ color: "rgba(232,220,200,0.9)" }}>
                SV Developers · Hoskote, Bangalore
              </p>
              <h1 style={{ margin: "0 0 1rem" }}>
                <Display color={CREAM} size="clamp(3rem,9vw,8rem)">The Aurora</Display>
                <Display italic color={GOLD} size="clamp(1.4rem,3.5vw,2.6rem)">Luxury Residences</Display>
              </h1>
              <p
                className="font-libre mb-9 max-w-xl"
                style={{ color: "rgba(232,220,200,0.85)", fontSize: "clamp(1rem,1.5vw,1.2rem)", lineHeight: 1.6, fontStyle: "italic" }}
              >
                “A quieter kind of wealth, on Hoskote highway.”
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{ background: CREAM, color: BROWN, fontWeight: 600, transition: `all 0.4s ${ease}` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = BROWN; }}
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
            </div>
          </div>

          <Link
            to="/"
            className="absolute top-24 left-5 sm:left-8 z-10 inline-flex items-center gap-2 font-body text-[0.65rem] tracking-[0.2em] uppercase"
            style={{ color: "rgba(232,220,200,0.8)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </section>

        {/* ──────────────── ABOUT ──────────────── */}
        <section className="relative py-24 sm:py-32" style={{ background: CREAM }}>
          <div className="container mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <Reveal>
                <p className="section-label font-body mb-4" style={{ color: "rgba(71,55,39,0.88)" }}>
                  About Aurora
                </p>
                <h2 className="mb-8">
                  <Display>Built to inherit.</Display>
                  <Display italic color={GOLD}>Detailed to admire.</Display>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <div className="space-y-6 font-libre" style={{ color: "#2a2018", fontSize: "1.08rem", lineHeight: 1.85 }}>
                  <p>
                    Luxury, to us, is not a finish. It is a set of decisions nobody tells you were made —
                    the proportion of a window, the way a lift lobby lands, the{" "}
                    <span style={{ fontWeight: 700, color: "#0f0d0a" }}>eighty-one percent</span> of this
                    site we will leave unbuilt.
                  </p>
                  <p>
                    Aurora sits on the Old Madras Road / Hoskote corridor — the next serious stretch of
                    Bangalore, redrawn by metro, highway, bullet train and airport. A 2.1-acre masterplan of
                    23+ storey towers, MIVAN-built, holding 2 &amp; 3 bedroom residences across four distinct
                    configurations, a multi-level clubhouse and a landscape engineered to remain the feature,
                    not the footnote.
                  </p>
                </div>
              </Reveal>

              {/* At-a-glance figures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-14 pt-10 border-t border-[#473727]/15">
                {highlights.map((h, i) => (
                  <Reveal key={h.v} delay={140 + i * 70}>
                    <div>
                      <p className="font-heading tabular-nums" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: "#0f0d0a", lineHeight: 1 }}>
                        {h.k}
                      </p>
                      <p className="font-body mt-2" style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: BROWN, opacity: 0.85 }}>
                        {h.v}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── HIGHLIGHTS — Residences + Specs ──────────────── */}
        <section className="relative py-24 sm:py-32" style={{ background: BROWN }}>
          <div className="container mx-auto px-5 sm:px-8 lg:px-10">
            <Reveal>
              <p className="section-label font-body mb-4" style={{ color: "rgba(232,220,200,0.85)" }}>
                Project Highlights
              </p>
              <h2 className="mb-14">
                <Display color={CREAM}>Four residences.</Display>
                <Display italic color={GOLD}>One standard.</Display>
              </h2>
            </Reveal>

            {/* Residences */}
            <div className="grid sm:grid-cols-2 gap-px mb-20" style={{ background: "rgba(232,220,200,0.12)" }}>
              {residences.map((r, i) => (
                <Reveal key={r.name} delay={i * 80}>
                  <div className="p-8 sm:p-10 h-full" style={{ background: BROWN }}>
                    <div className="flex items-baseline justify-between mb-3">
                      <p className="font-body" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, fontWeight: 600 }}>
                        {r.type}
                      </p>
                      <p className="font-heading" style={{ fontSize: "1.2rem", color: "rgba(232,220,200,0.9)", fontWeight: 700 }}>
                        {r.area}
                      </p>
                    </div>
                    <h3 className="mb-3">
                      <Display color={CREAM} size="clamp(1.6rem,3vw,2.2rem)">{r.name}</Display>
                    </h3>
                    <p className="font-libre" style={{ color: "rgba(232,220,200,0.7)", fontSize: "0.98rem", lineHeight: 1.6, fontStyle: "italic" }}>
                      {r.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Specifications + amenities */}
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
              <Reveal>
                <div>
                  <p className="section-label font-body mb-6" style={{ color: "rgba(232,220,200,0.85)" }}>
                    Specifications
                  </p>
                  <div>
                    {specs.map((s, i) => (
                      <div
                        key={s.k}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4"
                        style={{ borderBottom: "1px solid rgba(232,220,200,0.12)" }}
                      >
                        <span className="font-body" style={{ minWidth: 130, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, fontWeight: 600 }}>
                          {s.k}
                        </span>
                        <span className="font-libre" style={{ color: "rgba(232,220,200,0.85)", fontSize: "0.95rem", lineHeight: 1.55 }}>
                          {s.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div>
                  <p className="section-label font-body mb-6" style={{ color: "rgba(232,220,200,0.85)" }}>
                    45+ Curated Amenities
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      "Double-Height Lobby", "Private Cinema", "Business Lounge", "Co-working Suite",
                      "25m Lap Pool", "Fully-Equipped Gym", "Spa & Sauna", "Banquet Hall",
                      "Indoor Badminton", "Squash Court", "Tennis Court", "Pickleball",
                      "500m Jogging Loop", "Amphitheatre", "Kids' Atelier", "Sky Lounge",
                      "Stargazing Terrace", "Pet Park", "Meditation Grove", "Library",
                    ].map((a) => (
                      <span
                        key={a}
                        className="px-3.5 py-1.5 font-body"
                        style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(232,220,200,0.9)", fontWeight: 600, border: "1px solid rgba(232,220,200,0.25)" }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <p className="font-libre mt-6" style={{ color: "rgba(232,220,200,0.55)", fontSize: "0.9rem", fontStyle: "italic" }}>
                    Forty-five amenities. One rule: nobody waits.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ──────────────── GALLERY ──────────────── */}
        <section className="relative py-24 sm:py-32" style={{ background: CREAM }}>
          <div className="container mx-auto px-5 sm:px-8 lg:px-10">
            <Reveal>
              <p className="section-label font-body mb-4" style={{ color: "rgba(71,55,39,0.88)" }}>
                Gallery
              </p>
              <h2 className="mb-3">
                <Display>The architect's</Display>
                <Display italic color={GOLD}>first drawing.</Display>
              </h2>
              <p className="font-libre mb-12 max-w-xl" style={{ color: "#2a2018", fontSize: "1rem", lineHeight: 1.7 }}>
                CGI representations of the project. Indicative in nature.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {gallery.map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 80} className={i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""}>
                  <button
                    onClick={() => setLightbox(i)}
                    className="group relative block w-full overflow-hidden aspect-[4/3]"
                    style={{ height: "100%" }}
                  >
                    <img
                      src={src}
                      alt={`Aurora gallery ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 transition-colors duration-500" style={{ background: "rgba(71,55,39,0)" }} />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────── LOCATION ──────────────── */}
        <section className="relative py-24 sm:py-32" style={{ background: "#0f0d0a" }}>
          <div className="container mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <Reveal>
                <div>
                  <p className="section-label font-body mb-4" style={{ color: "rgba(232,220,200,0.85)" }}>
                    The Location
                  </p>
                  <h2 className="mb-6">
                    <Display color={CREAM}>On the Hoskote</Display>
                    <Display italic color={GOLD}>corridor.</Display>
                  </h2>
                  <p className="font-libre mb-10" style={{ color: "rgba(232,220,200,0.75)", fontSize: "1.02rem", lineHeight: 1.8 }}>
                    Aurora sits at the intersection of Bangalore's fastest-appreciating corridor and its most
                    dependable social infrastructure — beside MVJ Hospital, minutes from the upcoming metro,
                    25 minutes to the airport.
                  </p>
                  <div className="space-y-5">
                    {locationAnchors.map((a) => (
                      <div key={a.k} className="flex gap-4">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: GOLD }} />
                        <div>
                          <p className="font-body" style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 4 }}>
                            {a.k}
                          </p>
                          <p className="font-libre" style={{ color: "rgba(232,220,200,0.8)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                            {a.v}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="relative overflow-hidden" style={{ border: "1px solid rgba(232,220,200,0.18)" }}>
                  <iframe
                    title="Aurora location — Hoskote, Bangalore"
                    src="https://www.google.com/maps?q=Hoskote,+Bangalore&output=embed"
                    width="100%"
                    height="460"
                    style={{ border: 0, display: "block", filter: "grayscale(0.4) contrast(1.05)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ──────────────── DOWNLOAD CTA ──────────────── */}
        <section
          className="relative py-28 sm:py-40 text-center"
          style={{ background: BROWN }}
        >
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-heading select-none"
            style={{ fontSize: "26vw", color: "rgba(232,220,200,0.04)", lineHeight: 1 }}
          >
            AURORA
          </span>
          <div className="relative container mx-auto px-5">
            <Reveal>
              <p className="section-label font-body mb-5 justify-center" style={{ color: "rgba(232,220,200,0.85)", display: "inline-flex" }}>
                Pre-Launch · Heritage Edition
              </p>
              <h2 className="mb-6">
                <Display color={CREAM} size="clamp(2.4rem,6vw,5rem)">Get in early.</Display>
              </h2>
              <p className="font-libre mb-10 max-w-lg mx-auto" style={{ color: "rgba(232,220,200,0.8)", fontSize: "1.05rem", lineHeight: 1.7 }}>
                A location that is appreciating while you read this sentence. Request the full Pre-Launch
                deck and a member of our team will be in touch.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-3 px-9 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{ background: GOLD, color: "#fff", fontWeight: 600, transition: `all 0.4s ${ease}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = CREAM, e.currentTarget.style.color = BROWN)}
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD, e.currentTarget.style.color = "#fff")}
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      {/* ──────────────── LIGHTBOX ──────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ background: "rgba(15,13,10,0.94)", animation: "svFade 0.3s ease" }}
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center text-[#E8DCC8] hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={gallery[lightbox]}
            alt={`Aurora gallery ${lightbox + 1}`}
            className="max-w-full max-h-[85vh] object-contain"
            style={{ animation: `svRise 0.4s ${ease}` }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            aria-label="Previous"
            className="absolute left-4 sm:left-8 text-[#E8DCC8] hover:text-white text-3xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + gallery.length) % gallery.length); }}
          >
            ‹
          </button>
          <button
            aria-label="Next"
            className="absolute right-4 sm:right-8 text-[#E8DCC8] hover:text-white text-3xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % gallery.length); }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
