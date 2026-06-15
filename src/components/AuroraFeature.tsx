import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const GOLD = "#BE9234";
const CREAM = "#E8DCC8";
const BROWN = "#473727";
const ease = "cubic-bezier(0.16,1,0.3,1)";

const COUNTRY_CODES = [
  { code: "+91",  label: "🇮🇳 India (+91)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+1",   label: "🇺🇸 USA (+1)" },
  { code: "+44",  label: "🇬🇧 UK (+44)" },
  { code: "+65",  label: "🇸🇬 Singapore (+65)" },
  { code: "+61",  label: "🇦🇺 Australia (+61)" },
  { code: "+1",   label: "🇨🇦 Canada (+1)" },
  { code: "+966", label: "🇸🇦 Saudi Arabia (+966)" },
  { code: "+974", label: "🇶🇦 Qatar (+974)" },
  { code: "+965", label: "🇰🇼 Kuwait (+965)" },
  { code: "+973", label: "🇧🇭 Bahrain (+973)" },
  { code: "+968", label: "🇴🇲 Oman (+968)" },
  { code: "+60",  label: "🇲🇾 Malaysia (+60)" },
  { code: "+880", label: "🇧🇩 Bangladesh (+880)" },
  { code: "+92",  label: "🇵🇰 Pakistan (+92)" },
  { code: "+94",  label: "🇱🇰 Sri Lanka (+94)" },
  { code: "+977", label: "🇳🇵 Nepal (+977)" },
  { code: "+49",  label: "🇩🇪 Germany (+49)" },
  { code: "+33",  label: "🇫🇷 France (+33)" },
  { code: "+39",  label: "🇮🇹 Italy (+39)" },
  { code: "+34",  label: "🇪🇸 Spain (+34)" },
  { code: "+31",  label: "🇳🇱 Netherlands (+31)" },
  { code: "+7",   label: "🇷🇺 Russia (+7)" },
  { code: "+81",  label: "🇯🇵 Japan (+81)" },
  { code: "+86",  label: "🇨🇳 China (+86)" },
  { code: "+82",  label: "🇰🇷 South Korea (+82)" },
  { code: "+66",  label: "🇹🇭 Thailand (+66)" },
  { code: "+62",  label: "🇮🇩 Indonesia (+62)" },
  { code: "+63",  label: "🇵🇭 Philippines (+63)" },
  { code: "+55",  label: "🇧🇷 Brazil (+55)" },
  { code: "+52",  label: "🇲🇽 Mexico (+52)" },
  { code: "+27",  label: "🇿🇦 South Africa (+27)" },
  { code: "+234", label: "🇳🇬 Nigeria (+234)" },
  { code: "+254", label: "🇰🇪 Kenya (+254)" },
  { code: "+64",  label: "🇳🇿 New Zealand (+64)" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

type ModalState = "idle" | "open" | "loading" | "success" | "error";

/* ─── Project data ──────────────────────────────────────────────── */
interface Project {
  id: string;
  label: string;
  name: string;
  subtitle: string;
  description: string;
  bgImage: string;
  sharpImage: string;
  stats: [string, string][];
  cta: { label: string; to?: string; comingSoon?: boolean };
  locationHref?: string;
  locationLabel: string;
  hasDownload: boolean;
  hasEnquiry: boolean;
}

const PROJECTS: Project[] = [
  {
    id: "aurora",
    label: "Now Pre-Launching · View Location",
    name: "The Aurora",
    subtitle: "Luxury Residences",
    description:
      "A 2.6-acre masterplan with 81% open landscape, 23+ storey MIVAN-built towers and 45+ curated amenities — on Bangalore's fastest-appreciating eastern corridor. The project we have been building toward, in every sense.",
    bgImage: "/aurora%20pics/masterplan.png",
    sharpImage: "/aurora%20pics/masterplan.png",
    stats: [
      ["2.6-acres", "MASTERPLAN"],
      ["81%", "Open landscape"],
      ["45+", "Amenities"],
      ["23+", "Storeys"],
    ],
    cta: { label: "Explore The Aurora", to: "/aurora" },
    locationHref: "https://maps.app.goo.gl/2kKcgPPYZHWDuuRAA?g_st=ic",
    locationLabel: "Now Pre-Launching · View Location",
    hasDownload: true,
    hasEnquiry: false,
  },
  {
    id: "vcenclave",
    label: "On Sale · Kolar",
    name: "VC Enclave",
    subtitle: "Residential Layout, Kolar",
    description:
      "A RERA & KUDA-approved residential layout spanning 58,729 sq.m in Honnenahalli Village, Kolar — just off NH-4 between Bengaluru and Mulbagal. 258 plots across four site dimensions, with 54% residential land, dedicated parks and civic amenities. Vaastu-compliant, clear-title plots ready for your dream home.",
    bgImage: "/vcenclave.jpg",
    sharpImage: "/vcenclave.jpg",
    stats: [
      ["258", "Total Plots"],
      ["54.23%", "Residential Area"],
      ["16 acres", "Total Land"],
      ["10.91%", "Parks & Green"],
      ["RERA & KUDA", "Approved"],
    ],
    cta: { label: "Want to Know More About It?" },
    locationLabel: "On Sale · Kolar",
    hasDownload: false,
    hasEnquiry: true,
  },
];

/* ─── Keyframes injected once ───────────────────────────────────── */
const KEYFRAMES = `
  @keyframes upFade {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes panelReveal {
    from { opacity: 0; transform: translateX(36px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ruleGrow {
    from { transform: scaleY(0); opacity: 0; }
    to   { transform: scaleY(1); opacity: 1; }
  }
  @keyframes kenBurns {
    from { transform: scale(1.06); }
    to   { transform: scale(1.15); }
  }
  @keyframes statPop {
    0%   { opacity: 0; transform: translateY(16px) scale(0.92); }
    100% { opacity: 1; transform: translateY(0)    scale(1); }
  }
`;

function anim(name: string, duration: string, delay = "0ms", easing = ease): React.CSSProperties {
  return {
    animation: `${name} ${duration} ${easing} ${delay} both`,
  };
}

/* ─── Slide component ───────────────────────────────────────────── */
function ProjectSlide({
  project,
  onDownload,
  onEnquiry,
  isActive,
  animKey,
}: {
  project: Project;
  onDownload: () => void;
  onEnquiry: () => void;
  isActive: boolean;
  animKey: number;
}) {
  return (
    <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ minHeight: 640 }}>
      {/* Blurred shady background — Ken Burns when active */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${project.bgImage}')`,
          filter: "blur(3px) brightness(0.22) saturate(0.6)",
          transform: "scale(1.06)",
          ...(isActive
            ? { animation: `kenBurns 12s ease-in-out ${animKey} both alternate` }
            : {}),
        }}
      />

      {/* Left-side darkening gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(15,13,10,0.88) 0%, rgba(15,13,10,0.75) 50%, rgba(15,13,10,0.0) 100%)",
        }}
      />

      {/* Right 45% — sharp image overlay */}
      <div
        className="absolute top-0 right-0 bottom-0 hidden lg:block"
        style={{
          width: "45%",
          ...(isActive ? anim("panelReveal", "0.9s", "200ms") : { opacity: 0 }),
        }}
      >
        <img
          src={project.sharpImage}
          alt={project.name}
          className="w-full h-full object-cover object-center"
          style={{ filter: "contrast(1.08) saturate(1.1)" }}
        />
        {/* Feather blend from left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(15,13,10,0.95) 0%, rgba(15,13,10,0.3) 28%, rgba(15,13,10,0) 60%)",
          }}
        />
        {/* Gold rule — grows vertically */}
        <div
          className="absolute top-0 left-0 bottom-0 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            transformOrigin: "top center",
            ...(isActive ? anim("ruleGrow", "1.1s", "350ms", "cubic-bezier(0.4,0,0.2,1)") : { transform: "scaleY(0)", opacity: 0 }),
          }}
        />
      </div>

      {/* Content — left 55% — re-keyed on animKey to retrigger entrance */}
      <div className="relative container mx-auto px-5 sm:px-8 lg:px-10 py-24 sm:py-32">
        <div key={`content-${animKey}`} className="max-w-full lg:max-w-[52%]">
          {/* Label */}
          <div style={isActive ? anim("upFade", "0.7s", "0ms") : { opacity: 0 }}>
            {project.locationHref ? (
              <a
                href={project.locationHref}
                target="_blank"
                rel="noopener noreferrer"
                className="section-label font-body mb-5 inline-block hover:opacity-80 transition-opacity"
                style={{ color: "rgba(232,220,200,0.85)" }}
              >
                {project.locationLabel}
              </a>
            ) : (
              <p
                className="section-label font-body mb-5 inline-block"
                style={{ color: GOLD }}
              >
                {project.locationLabel}
              </p>
            )}
          </div>

          {/* Title */}
          <h2 style={{ margin: "0 0 1.25rem", ...(isActive ? anim("upFade", "0.75s", "110ms") : { opacity: 0 }) }}>
            <span
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "clamp(2.8rem,7vw,6rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: CREAM,
                display: "block",
              }}
            >
              {project.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.3rem,3vw,2.2rem)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.01em",
                color: GOLD,
                display: "block",
              }}
            >
              {project.subtitle}
            </span>
          </h2>

          {/* Description */}
          <p
            className="font-libre mb-9"
            style={{
              color: "rgba(232,220,200,0.82)",
              fontSize: "clamp(1rem,1.4vw,1.15rem)",
              lineHeight: 1.75,
              ...(isActive ? anim("upFade", "0.75s", "220ms") : { opacity: 0 }),
            }}
          >
            {project.description}
          </p>

          {/* Stats — each pops in with stagger */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 mb-10">
            {project.stats.map(([k, v], i) => (
              <div
                key={v}
                style={isActive ? anim("statPop", "0.6s", `${320 + i * 80}ms`) : { opacity: 0 }}
              >
                <p
                  className="font-heading"
                  style={{ fontSize: "1.9rem", fontWeight: 700, color: CREAM, lineHeight: 1 }}
                >
                  {k}
                </p>
                <p
                  className="font-body mt-1"
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(232,220,200,0.7)",
                    fontWeight: 600,
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={isActive ? anim("upFade", "0.7s", "600ms") : { opacity: 0 }}
          >
            {project.hasEnquiry ? (
              <button
                onClick={onEnquiry}
                className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{ background: CREAM, color: BROWN, fontWeight: 600, transition: `all 0.4s ${ease}`, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = BROWN; }}
              >
                Want to Know More About It?
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ) : project.cta.to ? (
              <Link
                to={project.cta.to}
                className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{ background: CREAM, color: BROWN, fontWeight: 600, transition: `all 0.4s ${ease}` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = BROWN; }}
              >
                {project.cta.label}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{ background: CREAM, color: BROWN, fontWeight: 600, transition: `all 0.4s ${ease}`, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = BROWN; }}
              >
                {project.cta.label}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}

            {project.hasDownload && (
              <button
                onClick={onDownload}
                className="group inline-flex items-center gap-3 px-8 py-4 font-body text-[0.72rem] tracking-[0.22em] uppercase"
                style={{
                  background: "transparent",
                  color: CREAM,
                  border: `1px solid rgba(232,220,200,0.45)`,
                  fontWeight: 600,
                  transition: `all 0.4s ${ease}`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(232,220,200,0.45)"; e.currentTarget.style.color = CREAM; }}
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function AuroraFeature() {
  const [modal, setModal] = useState<ModalState>("idle");
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", countryCode: "+91" });
  const [errorMsg, setErrorMsg] = useState("");

  const [vcModal, setVcModal] = useState<ModalState>("idle");
  const [vcForm, setVcForm] = useState<FormState>({ name: "", email: "", phone: "", countryCode: "+91" });
  const [vcErrorMsg, setVcErrorMsg] = useState("");
  const [current, setCurrent] = useState(0);
  const [animKeys, setAnimKeys] = useState<number[]>(PROJECTS.map((_, i) => (i === 0 ? 1 : 0)));
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAnimKeys((prev) => prev.map((k, i) => (i === current ? k + 1 : k)));
  }, [current]);

  function resetAutoPlay() {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % PROJECTS.length);
    }, 5000);
  }

  useEffect(() => {
    resetAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, []);

  /* drag-to-swipe with velocity detection */
  const dragStart = useRef<{ x: number; t: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = { x: e.clientX, t: Date.now() };
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragStart.current) return;
    const dx = dragStart.current.x - e.clientX;
    const dt = Date.now() - dragStart.current.t;
    const velocity = Math.abs(dx) / Math.max(dt, 1);
    if (dx > 40 || (dx > 10 && velocity > 0.3)) {
      setCurrent((c) => (c + 1) % PROJECTS.length);
      resetAutoPlay();
    } else if (dx < -40 || (dx < -10 && velocity > 0.3)) {
      setCurrent((c) => (c - 1 + PROJECTS.length) % PROJECTS.length);
      resetAutoPlay();
    }
    dragStart.current = null;
  }
  function onPointerCancel() { dragStart.current = null; }

  function openModal() {
    setForm({ name: "", email: "", phone: "", countryCode: "+91" });
    setErrorMsg("");
    setModal("open");
  }

  function closeModal() {
    if (modal === "loading") return;
    setModal("idle");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function openVcModal() {
    setVcForm({ name: "", email: "", phone: "", countryCode: "+91" });
    setVcErrorMsg("");
    setVcModal("open");
  }

  function closeVcModal() {
    if (vcModal === "loading") return;
    setVcModal("idle");
  }

  function handleVcChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVcForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleVcSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVcModal("loading");
    setVcErrorMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vcForm.name,
          email: vcForm.email,
          phone: `${vcForm.countryCode}${vcForm.phone}`,
          project: "VC Enclave",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setVcModal("success");
      } else {
        setVcErrorMsg(
          json.errors
            ? Object.values(json.errors).flat().join(" ")
            : json.message ?? "Something went wrong. Please try again."
        );
        setVcModal("error");
      }
    } catch {
      setVcErrorMsg("Network error. Please check your connection and try again.");
      setVcModal("error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModal("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/brochure-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          project: "Aurora",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setModal("success");
      } else {
        setErrorMsg(
          json.errors
            ? Object.values(json.errors).flat().join(" ")
            : json.message ?? "Something went wrong. Please try again."
        );
        setModal("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setModal("error");
    }
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <section style={{ background: "#0f0d0a" }}>

        {/* ── Section header ── */}
        <div className="container mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-10">
          <Reveal>
            <p
              className="section-label font-body mb-3"
              style={{ color: "rgba(232,220,200,0.7)" }}
            >
              SV Developers
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.0rem,5vw,4rem)",
                fontWeight: 800,
                letterSpacing: "0.09em",
                lineHeight: 1,
                color: CREAM,
                margin: 0,
              }}
            >
              Upcoming Projects
            </h2>
          </Reveal>
        </div>

        {/* ── Carousel track ── */}
        <div
          className="relative"
          onMouseEnter={() => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); }}
          onMouseLeave={resetAutoPlay}
        >
          <div
            className="overflow-hidden select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{ cursor: "grab", touchAction: "pan-y" }}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{
                transform: `translateX(-${current * 100}%)`,
                transition: `transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)`,
              }}
            >
              {PROJECTS.map((project, i) => (
                <ProjectSlide
                  key={project.id}
                  project={project}
                  onDownload={openModal}
                  onEnquiry={openVcModal}
                  isActive={i === current}
                  animKey={animKeys[i]}
                />
              ))}
            </div>
          </div>

          {/* Overlay prev arrow — vertically centred on the slide */}
          <button
            onClick={() => { setCurrent((c) => (c - 1 + PROJECTS.length) % PROJECTS.length); resetAutoPlay(); }}
            aria-label="Previous project"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(15,13,10,0.45)",
              border: `1px solid rgba(232,220,200,0.25)`,
              color: CREAM,
              backdropFilter: "blur(4px)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(190,146,52,0.75)`; e.currentTarget.style.borderColor = GOLD; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(15,13,10,0.45)"; e.currentTarget.style.borderColor = "rgba(232,220,200,0.25)"; }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Overlay next arrow — vertically centred on the slide */}
          <button
            onClick={() => { setCurrent((c) => (c + 1) % PROJECTS.length); resetAutoPlay(); }}
            aria-label="Next project"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(15,13,10,0.45)",
              border: `1px solid rgba(232,220,200,0.25)`,
              color: CREAM,
              backdropFilter: "blur(4px)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(190,146,52,0.75)`; e.currentTarget.style.borderColor = GOLD; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(15,13,10,0.45)"; e.currentTarget.style.borderColor = "rgba(232,220,200,0.25)"; }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Dot indicators ── */}
        <div className="flex justify-center gap-2.5 py-8">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setCurrent(i); resetAutoPlay(); }}
              aria-label={`Go to ${p.name}`}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                background: i === current ? GOLD : "rgba(232,220,200,0.25)",
                border: "none",
                cursor: "pointer",
                transition: `all 0.4s ${ease}`,
                padding: 0,
              }}
            />
          ))}
        </div>

      </section>

      {/* ── Brochure download modal ── */}
      {modal !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,13,10,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="relative w-full max-w-md"
            style={{ background: CREAM, padding: "2.5rem 2rem" }}
          >
            {/* Gold top bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(to right, ${GOLD}, rgba(190,146,52,0.25))`,
              }}
            />

            {modal !== "loading" && (
              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: BROWN,
                  opacity: 0.5,
                  padding: 4,
                }}
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {modal === "success" ? (
              <div className="text-center py-4">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11.5L9 16.5L18 6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-heading" style={{ fontSize: "1.5rem", color: BROWN, marginBottom: 10 }}>
                  Thank You
                </h3>
                <p className="font-libre" style={{ color: "#6b5744", lineHeight: 1.7 }}>
                  Our team will share the Aurora brochure shortly.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 font-body text-[0.7rem] tracking-[0.2em] uppercase px-8 py-3"
                  style={{ background: BROWN, color: CREAM, border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p
                  className="section-label font-body mb-1"
                  style={{ color: GOLD, letterSpacing: "0.2em", fontSize: "0.65rem" }}
                >
                  The Aurora
                </p>
                <h3 className="font-heading" style={{ fontSize: "1.6rem", color: BROWN, marginBottom: "1.5rem" }}>
                  Download Brochure
                </h3>

                {modal === "error" && errorMsg && (
                  <p
                    style={{
                      background: "#fef0ee",
                      color: "#b91c1c",
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {(["name", "email"] as const).map((field) => (
                  <div key={field} style={{ marginBottom: "1rem" }}>
                    <label
                      htmlFor={`brochure-${field}`}
                      className="font-body"
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: BROWN,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {field}
                      <span style={{ color: GOLD }}> *</span>
                    </label>
                    <input
                      id={`brochure-${field}`}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      disabled={modal === "loading"}
                      placeholder={field === "name" ? "Your full name" : "you@example.com"}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: `1px solid rgba(71,55,39,0.25)`,
                        background: "#fff",
                        color: BROWN,
                        fontSize: "0.95rem",
                        outline: "none",
                        boxSizing: "border-box",
                        opacity: modal === "loading" ? 0.6 : 1,
                      }}
                    />
                  </div>
                ))}

                {/* Phone with country code */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="brochure-phone"
                    className="font-body"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: BROWN,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Phone / WhatsApp <span style={{ color: GOLD }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 0 }}>
                    <select
                      value={form.countryCode}
                      onChange={(e) => setForm((prev) => ({ ...prev, countryCode: e.target.value }))}
                      disabled={modal === "loading"}
                      style={{
                        flexShrink: 0,
                        padding: "10px 8px",
                        border: `1px solid rgba(71,55,39,0.25)`,
                        borderRight: "none",
                        background: "#f5f0e8",
                        color: BROWN,
                        fontSize: "0.82rem",
                        outline: "none",
                        cursor: "pointer",
                        opacity: modal === "loading" ? 0.6 : 1,
                        maxWidth: 160,
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.label} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      id="brochure-phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      disabled={modal === "loading"}
                      placeholder="10-digit number"
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: `1px solid rgba(71,55,39,0.25)`,
                        background: "#fff",
                        color: BROWN,
                        fontSize: "0.95rem",
                        outline: "none",
                        boxSizing: "border-box",
                        opacity: modal === "loading" ? 0.6 : 1,
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={modal === "loading"}
                  className="font-body text-[0.72rem] tracking-[0.2em] uppercase"
                  style={{
                    width: "100%",
                    padding: "13px",
                    background: modal === "loading" ? "#9c8370" : BROWN,
                    color: CREAM,
                    border: "none",
                    cursor: modal === "loading" ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: `background 0.3s ${ease}`,
                  }}
                >
                  {modal === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Get Brochure"
                  )}
                </button>

                <p
                  className="font-body"
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(71,55,39,0.55)",
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── VC Enclave enquiry modal ── */}
      {vcModal !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,13,10,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && closeVcModal()}
        >
          <div
            className="relative w-full max-w-md"
            style={{ background: CREAM, padding: "2.5rem 2rem" }}
          >
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(to right, ${GOLD}, rgba(190,146,52,0.25))`,
              }}
            />

            {vcModal !== "loading" && (
              <button
                onClick={closeVcModal}
                style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: BROWN, opacity: 0.5, padding: 4 }}
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {vcModal === "success" ? (
              <div className="text-center py-4">
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11.5L9 16.5L18 6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-heading" style={{ fontSize: "1.5rem", color: BROWN, marginBottom: 10 }}>Thank You</h3>
                <p className="font-libre" style={{ color: "#6b5744", lineHeight: 1.7 }}>
                  Our team will get in touch with you shortly about VC Enclave.
                </p>
                <button
                  onClick={closeVcModal}
                  className="mt-6 font-body text-[0.7rem] tracking-[0.2em] uppercase px-8 py-3"
                  style={{ background: BROWN, color: CREAM, border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleVcSubmit}>
                <p className="section-label font-body mb-1" style={{ color: GOLD, letterSpacing: "0.2em", fontSize: "0.65rem" }}>
                  VC Enclave
                </p>
                <h3 className="font-heading" style={{ fontSize: "1.6rem", color: BROWN, marginBottom: "1.5rem" }}>
                  Get in Touch
                </h3>

                {vcModal === "error" && vcErrorMsg && (
                  <p style={{ background: "#fef0ee", color: "#b91c1c", padding: "10px 14px", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {vcErrorMsg}
                  </p>
                )}

                {(["name", "email"] as const).map((field) => (
                  <div key={field} style={{ marginBottom: "1rem" }}>
                    <label
                      htmlFor={`vc-${field}`}
                      className="font-body"
                      style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: BROWN, fontWeight: 600, marginBottom: 6 }}
                    >
                      {field}<span style={{ color: GOLD }}> *</span>
                    </label>
                    <input
                      id={`vc-${field}`}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      required
                      value={vcForm[field]}
                      onChange={handleVcChange}
                      disabled={vcModal === "loading"}
                      placeholder={field === "name" ? "Your full name" : "you@example.com"}
                      style={{ width: "100%", padding: "10px 12px", border: `1px solid rgba(71,55,39,0.25)`, background: "#fff", color: BROWN, fontSize: "0.95rem", outline: "none", boxSizing: "border-box", opacity: vcModal === "loading" ? 0.6 : 1 }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="vc-phone"
                    className="font-body"
                    style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: BROWN, fontWeight: 600, marginBottom: 6 }}
                  >
                    Phone / WhatsApp <span style={{ color: GOLD }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 0 }}>
                    <select
                      value={vcForm.countryCode}
                      onChange={(e) => setVcForm((prev) => ({ ...prev, countryCode: e.target.value }))}
                      disabled={vcModal === "loading"}
                      style={{ flexShrink: 0, padding: "10px 8px", border: `1px solid rgba(71,55,39,0.25)`, borderRight: "none", background: "#f5f0e8", color: BROWN, fontSize: "0.82rem", outline: "none", cursor: "pointer", opacity: vcModal === "loading" ? 0.6 : 1, maxWidth: 160 }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.label} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      id="vc-phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      value={vcForm.phone}
                      onChange={(e) => setVcForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      disabled={vcModal === "loading"}
                      placeholder="10-digit number"
                      style={{ flex: 1, padding: "10px 12px", border: `1px solid rgba(71,55,39,0.25)`, background: "#fff", color: BROWN, fontSize: "0.95rem", outline: "none", boxSizing: "border-box", opacity: vcModal === "loading" ? 0.6 : 1, minWidth: 0 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={vcModal === "loading"}
                  className="font-body text-[0.72rem] tracking-[0.2em] uppercase"
                  style={{ width: "100%", padding: "13px", background: vcModal === "loading" ? "#9c8370" : BROWN, color: CREAM, border: "none", cursor: vcModal === "loading" ? "not-allowed" : "pointer", fontWeight: 600, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: `background 0.3s ${ease}` }}
                >
                  {vcModal === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                  ) : "Send Enquiry"}
                </button>

                <p className="font-body" style={{ fontSize: "0.7rem", color: "rgba(71,55,39,0.55)", textAlign: "center", marginTop: 12 }}>
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
