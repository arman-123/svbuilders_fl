import { useState, useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowUpRight, CheckCircle2, ArrowLeft, X } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: 1, name: "Gopal Grand Residency", location: "B V Reddy Colony, Chittoor",
    category: "luxury", type: "3 BHK Apartments", floors: 6, units: 22,
    area: "1800 sq. ft.", status: "Ongoing", image: "https://i.ibb.co/gLFyyKh7/GGR.png",
    description: "Gopal Grand Residency is a landmark residential development redefining premium living in Chittoor. Thoughtfully designed as the first luxury apartment project in the city.",
    fullDescription: "The project comprises 6 well-planned floors housing 22 exclusive apartments, ensuring privacy, low density, and a close-knit community living experience.",
    highlights: ["First luxury apartment project in Chittoor","Low-density development for enhanced privacy","Modern elevation with premium materials","Spacious balconies and ample natural light","Designed for contemporary urban living"],
  },
  {
    id: 2, name: "VC Enclave", location: "Indiranagar, Bengaluru",
    category: "luxury", type: "2 & 3 BHK Apartments", floors: 5, units: 20,
    area: "1500 – 1800 sq. ft.", status: "Completed 2024", image: "https://i.ibb.co/1tg897L5/VCE.png",
    description: "VC Enclave is an exclusive luxury residential apartment in the prime neighbourhood of Indiranagar, designed for discerning homeowners who value space, privacy, and contemporary elegance.",
    fullDescription: "5 residential floors with only 20 exclusive apartments ensuring a low-density living environment. Features a striking contemporary elevation with clean lines and rich material finishes.",
    highlights: ["Luxury apartment project in Indiranagar","Low-density development for enhanced privacy","Contemporary architecture with premium façade","Wide balconies and cross ventilation","High-quality construction and refined finishes"],
  },
  {
    id: 3, name: "Sree Lakshmi Nilayam", location: "Indiranagar, Bengaluru",
    category: "luxury", type: "3 & 4 BHK", floors: 5, units: 3,
    area: "1800 – 5800 sq. ft.", status: "Completed 2020", image: "https://i.ibb.co/VY9Phqfj/SLN.png",
    description: "Sree Lakshmi Nilayam is an exclusive boutique residential development in Indiranagar, designed for homeowners seeking privacy, space, and refined urban living.",
    fullDescription: "Only 3 exclusive homes across 5 floors — ultra-low-density development offering villa-like living within an apartment format. Includes a signature 4 BHK penthouse of 5800 sq. ft.",
    highlights: ["Boutique luxury residential development","Only 3 exclusive residences","Ultra-spacious 4 BHK duplex/penthouse","Extremely low-density, villa-style living","Contemporary architecture with premium finishes"],
  },
  {
    id: 4, name: "S V Aralia", location: "Whitefield, Bengaluru",
    category: "mid-range", type: "2 & 3 BHK Apartments", floors: 4, units: 42,
    area: "1200 – 1500 sq. ft.", status: "Completed 2013", image: "https://i.ibb.co/FqjQTsDn/SV.png",
    description: "S V Aralia is a well-planned residential apartment community in Whitefield, one of Bengaluru's most established residential and IT corridors.",
    fullDescription: "4 residential floors with 42 apartments offering a balanced mix of 2 BHK and 3 BHK homes. Close to major IT parks, schools, hospitals, and public transport.",
    highlights: ["Well-planned apartments in Whitefield","Wide balconies and efficient layouts","Good natural light and cross ventilation","Quality construction with long-term durability","Ideal for end-users and long-term investors"],
  },
  {
    id: 5, name: "SLV Greens", location: "Whitefield, Bengaluru",
    category: "mid-range", type: "2 & 3 BHK Apartments", floors: 4, units: 80,
    area: "1200 – 1500 sq. ft.", status: "Completed 2014", image: "https://i.ibb.co/jmKGzKq/SVL.png",
    description: "SLV Greens is a thoughtfully planned residential apartment project in Whitefield, one of Bengaluru's prominent residential and IT hubs.",
    fullDescription: "4 residential floors with 80 apartments, a well-balanced mix of 2 BHK and 3 BHK homes. Close to IT parks, schools, hospitals, and shopping zones.",
    highlights: ["Functional layouts with spacious living areas","Wide balconies with good ventilation","Quality construction with long-term durability","Established residential community","Convenient access to IT hubs and amenities"],
  },
  {
    id: 6, name: "D S Paradise", location: "Gottigere, Bengaluru",
    category: "economical", type: "2 BHK Apartments", floors: 4, units: 10,
    area: "1200 sq. ft.", status: "Available", image: "https://i.ibb.co/3LCQh20/DSP.png",
    description: "D S Paradise is a thoughtfully designed economical residential apartment project in Gottigere, offering comfortable and practical homes for modern families.",
    fullDescription: "4 residential floors with 10 apartments — a low-density and peaceful living environment. All 2 BHK apartments of 1200 sq. ft. with efficient space use and natural light.",
    highlights: ["Economical residential apartment project","Functional layouts with efficient space utilization","Good natural light and ventilation","Quality construction at an affordable price","Convenient access to daily amenities"],
  },
  {
    id: 7, name: "G S Exotica", location: "Gottigere, Bengaluru",
    category: "economical", type: "2 & 3 BHK Apartments", floors: 4, units: 40,
    area: "1200 – 1500 sq. ft.", status: "Available", image: "https://i.ibb.co/2xt2Py0/GSE.png",
    description: "G S Exotica is a well-planned economical residential apartment project in Gottigere, offering practical and comfortable homes at an affordable price point.",
    fullDescription: "4 residential floors with 40 apartments. Located near Bannerghatta Road with easy access to schools, hospitals, supermarkets, and major employment hubs.",
    highlights: ["Mix of 2 BHK & 3 BHK homes","Practical layouts with efficient space utilization","Good ventilation and natural light","Easy access to daily amenities and main roads","Ideal for families and first-time homebuyers"],
  },
];

type Project = (typeof projects)[0];

const CAT_META = {
  luxury:      { label: "Luxury",      tag: "Collection I",   colHex: "#c9a96e", col3: 0xc9a96e, sub: "Curated luxury residences · Bespoke craftsmanship" },
  "mid-range": { label: "Premium",     tag: "Collection II",  colHex: "#8c7f74", col3: 0x8c7f74, sub: "Premium apartments · Contemporary design" },
  economical:  { label: "Residential", tag: "Collection III", colHex: "#b5a89a", col3: 0xb5a89a, sub: "Quality homes · Accessible excellence" },
} as const;
type CatKey = keyof typeof CAT_META;

const CAT_VIDEO: Record<CatKey, string> = {
  luxury:      "/luxury.mp4",
  "mid-range": "/premium.mp4",
  economical:  "/Residential.mp4",
};

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const open = project !== null;
  useLayoutEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Hover-preview panel: pointer-transparent so hover/click pass straight
  // through to the project cards beneath it (prevents flicker, lets a click
  // open the full modal even on cards sitting under the panel).
  return (
    <>
      <div data-lenis-prevent style={{ position:"fixed",top:0,right:0,bottom:0,width:"min(440px,92vw)",background:"#FCFAF5",borderLeft:"1px solid rgba(71,55,39,0.14)",zIndex:4000,transform:open?"translateX(0)":"translateX(100%)",transition:"transform .6s cubic-bezier(.16,1,.3,1), opacity .4s ease",opacity:open?1:0,overflowY:"auto",overscrollBehavior:"contain",pointerEvents:"none",boxShadow:open?"-30px 0 80px rgba(20,9,4,0.16)":"none" }}>
        <div style={{ position:"absolute",top:22,right:26,fontFamily:"var(--font-mono)",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(71,55,39,0.4)" }}>
          Click to open
        </div>

        {project && (
          <div style={{ padding:"64px 44px 56px" }}>
            <div style={{ fontSize:"0.53rem",letterSpacing:"0.20em",color:"rgba(71,55,39,0.55)",textTransform:"uppercase",fontFamily:"Inter,sans-serif",marginBottom:14 }}>
              {`0${project.id}`} — {(CAT_META[project.category as CatKey]?.label ?? project.category).toUpperCase()}
            </div>
            <div className="font-heading" style={{ fontSize:"clamp(1.9rem,4vw,2.6rem)",fontWeight:300,lineHeight:1.08,color:"#1C0D07",marginBottom:6 }}>{project.name}</div>
            <div style={{ fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.05rem",color:"rgba(71,55,39,0.55)",marginBottom:10 }}>{project.type}</div>
            <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",color:"rgba(71,55,39,0.45)",textTransform:"uppercase",fontFamily:"Inter,sans-serif" }}>{project.location}</div>
            <div style={{ height:1,background:"rgba(71,55,39,0.10)",margin:"24px 0" }} />
            <div style={{ width:"100%",aspectRatio:"16/9",overflow:"hidden",marginBottom:24,background:"rgba(71,55,39,0.06)" }}>
              <img src={project.image} alt={project.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
            </div>
            <p style={{ fontSize:"0.72rem",lineHeight:1.9,color:"rgba(71,55,39,0.65)",letterSpacing:"0.03em",fontFamily:"Inter,sans-serif" }}>{project.description}</p>
            <div style={{ marginTop:28 }}>
              {([["Status",project.status],["Floors",String(project.floors)],["Units",String(project.units)],["Area",project.area],["Config",project.type]] as [string,string][]).map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid rgba(71,55,39,0.08)",fontSize:"0.62rem",letterSpacing:"0.10em" }}>
                  <span style={{ color:"rgba(71,55,39,0.45)",textTransform:"uppercase",fontFamily:"Inter,sans-serif" }}>{k}</span>
                  <span style={{ color:"#1C0D07",fontFamily:"Inter,sans-serif" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:28 }}>
              <p style={{ fontSize:"0.55rem",letterSpacing:"0.18em",color:"rgba(71,55,39,0.40)",textTransform:"uppercase",fontFamily:"Inter,sans-serif",marginBottom:14 }}>Highlights</p>
              {project.highlights.map((h,i)=>(
                <div key={i} style={{ display:"flex",gap:10,marginBottom:9,alignItems:"flex-start" }}>
                  <CheckCircle2 style={{ width:13,height:13,color:"#473727",flexShrink:0,marginTop:1 }} />
                  <span style={{ fontSize:"0.68rem",lineHeight:1.7,color:"rgba(44,22,8,0.72)",fontFamily:"Inter,sans-serif" }}>{h}</span>
                </div>
              ))}
            </div>
            <a href="/#contact" onClick={onClose} className="btn-fill" style={{ marginTop:38,display:"inline-flex",alignItems:"center",gap:10,fontSize:"0.6rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"#E8DCC8",background:"#473727",border:"1px solid #473727",padding:"13px 22px",fontFamily:"Inter,sans-serif",textDecoration:"none" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#2C1605";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#473727";}}
            >
              Enquire About This Project <ArrowUpRight style={{ width:13,height:13 }} />
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Centered full-detail modal (opens on click) ─────────────────────────────

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useLayoutEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!project) return null;
  const p = project;
  const cat = CAT_META[p.category as CatKey]?.label ?? p.category;
  const GOLD = "#C9A96E";

  const badge = (text: string) => (
    <span style={{
      fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.2em",
      textTransform: "uppercase", padding: "5px 12px", color: "#F0E6D2",
      background: "rgba(201,169,110,0.20)", border: "1px solid rgba(201,169,110,0.45)",
      backdropFilter: "blur(4px)",
    }}>{text}</span>
  );

  return (
    <div
      onClick={onClose}
      className="animate-fade-in"
      style={{
        position: "fixed", inset: 0, zIndex: 4600, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "clamp(12px,4vw,40px)",
        background: "rgba(20,9,4,0.74)", backdropFilter: "blur(10px)",
      }}
    >
      <div
        data-lenis-prevent
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 880, maxHeight: "90vh",
          overflowY: "auto", overscrollBehavior: "contain", background: "#F7F1E6",
          boxShadow: "0 40px 120px rgba(20,9,4,0.5)",
          animation: "scale-in 0.5s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 18, right: 18, zIndex: 10, width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(247,241,230,0.85)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(71,55,39,0.18)", cursor: "pointer",
            transition: "background .35s var(--ease-lux), transform .35s var(--ease-lux)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#473727"; (e.currentTarget as HTMLElement).style.transform = "rotate(90deg)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(247,241,230,0.85)"; (e.currentTarget as HTMLElement).style.transform = "rotate(0deg)"; }}
        >
          <X style={{ width: 16, height: 16, color: "#473727" }} />
        </button>

        {/* Hero image */}
        <div style={{ position: "relative", height: "clamp(220px,38vh,360px)", overflow: "hidden" }}>
          <img src={p.image} alt={p.name} className="animate-ken-burns"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,9,4,0.88) 0%, rgba(20,9,4,0.18) 56%, transparent 100%)" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, padding: "clamp(22px,4vw,40px)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {badge(p.status)}
              {badge(cat)}
            </div>
            <h2 className="font-heading" style={{ fontSize: "clamp(2rem,5vw,3.3rem)", fontWeight: 500, color: "#FBF7F0", lineHeight: 1.02 }}>
              {p.name}
            </h2>
            <p style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,230,210,0.72)" }}>
              {p.location}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "clamp(24px,4vw,44px)" }}>
          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(14px,2.4vw,26px)",
            padding: "clamp(20px,3vw,28px) 0", marginBottom: 30,
            borderTop: "1px solid rgba(71,55,39,0.14)", borderBottom: "1px solid rgba(71,55,39,0.14)",
          }} className="sm:!grid-cols-4">
            {([["Floors", String(p.floors)], ["Units", String(p.units)], ["Area", p.area], ["Config", p.type]] as [string, string][]).map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(71,55,39,0.50)", marginBottom: 7 }}>{k}</p>
                <p className="font-heading" style={{ fontSize: "clamp(1.3rem,2.4vw,1.9rem)", fontWeight: 500, color: "#1C0D07", lineHeight: 1 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <p className="font-libre" style={{ fontSize: "clamp(1rem,1.8vw,1.18rem)", lineHeight: 1.85, color: "rgba(44,22,8,0.82)", marginBottom: 16 }}>
            {p.description}
          </p>
          <p className="font-libre" style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "rgba(44,22,8,0.6)", marginBottom: 32 }}>
            {p.fullDescription}
          </p>

          {/* Highlights */}
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>
            Key Highlights
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 36 }} className="sm:!grid-cols-2">
            {p.highlights.map((h, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                background: "rgba(71,55,39,0.05)", border: "1px solid rgba(71,55,39,0.08)",
                transition: "background .35s var(--ease-lux), transform .35s var(--ease-lux)",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.14)"; (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(71,55,39,0.05)"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
              >
                <CheckCircle2 style={{ width: 15, height: 15, color: "#473727", flexShrink: 0, marginTop: 2 }} />
                <span className="font-libre" style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(44,22,8,0.78)" }}>{h}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 26, borderTop: "1px solid rgba(71,55,39,0.10)", justifyContent: "center" }}>
            <a href="/#contact" onClick={onClose} className="btn-fill" style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 34px",
              background: "#473727", color: "#E8DCC8", fontFamily: "var(--font-mono)",
              fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
            }}>
              Enquire About This Project <ArrowUpRight style={{ width: 14, height: 14 }} />
            </a>
            <button onClick={onClose} style={{
              padding: "14px 34px", background: "transparent", border: "1px solid rgba(71,55,39,0.25)",
              color: "rgba(71,55,39,0.72)", cursor: "pointer", fontFamily: "var(--font-mono)",
              fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
              transition: "background .35s var(--ease-lux), color .35s var(--ease-lux)",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(71,55,39,0.08)"; (e.currentTarget as HTMLElement).style.color = "#1C0D07"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(71,55,39,0.72)"; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Portal card texture (image top, info bottom) ─────────────────────────────

// Unsplash images per category (CORS-safe for canvas use)
const PORTAL_IMAGES: Record<CatKey, string> = {
  luxury:      "/luxury.jpg",
  "mid-range": "/premium.jpg",
  economical:  "/residential.jpg",
};

function loadPortalImage(src: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

function makePortalTexture(catKey: CatKey, highlighted: boolean, img: HTMLImageElement | null): THREE.CanvasTexture {
  const meta  = CAT_META[catKey];
  const count = projects.filter(p => p.category === catKey).length;
  const CW = 510, CH = 720;             // matches PlaneGeometry aspect 170:240
  const IMG_H = Math.round(CH * 0.58);  // image zone: 417 px
  const INFO_Y = IMG_H;

  const cv = document.createElement("canvas");
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext("2d")!;

  // Full card background
  ctx.fillStyle = "#FAF6EE"; ctx.fillRect(0, 0, CW, CH);

  // Image zone
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, CW, IMG_H); ctx.clip();
    const ir = img.naturalWidth / img.naturalHeight, cr = CW / IMG_H;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (ir > cr) { sw = sh * cr; sx = (img.naturalWidth - sw) / 2; }
    else         { sh = sw / cr; sy = (img.naturalHeight - sh) / 5; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CW, IMG_H);
    const ov = ctx.createLinearGradient(0, IMG_H * 0.5, 0, IMG_H);
    ov.addColorStop(0, "rgba(20,9,4,0)"); ov.addColorStop(1, "rgba(20,9,4,0.50)");
    ctx.fillStyle = ov; ctx.fillRect(0, 0, CW, IMG_H);
    ctx.restore();
  } else {
    const ph = ctx.createLinearGradient(0, 0, CW, IMG_H);
    ph.addColorStop(0, meta.colHex + "55"); ph.addColorStop(1, meta.colHex + "22");
    ctx.fillStyle = ph; ctx.fillRect(0, 0, CW, IMG_H);
  }

  // Accent bar
  ctx.fillStyle = meta.colHex + (highlighted ? "ee" : "99");
  ctx.fillRect(0, INFO_Y, CW, 3);

  // Outer border
  ctx.strokeStyle = highlighted ? meta.colHex : "rgba(181,168,154,0.42)";
  ctx.lineWidth   = highlighted ? 2.5 : 1;
  ctx.strokeRect(1.5, 1.5, CW - 3, CH - 3);

  // Tag
  ctx.fillStyle = "rgba(140,127,116,0.72)";
  ctx.font = "300 13px monospace";
  ctx.fillText(meta.tag.toUpperCase(), 28, INFO_Y + 40);

  ctx.strokeStyle = "rgba(181,168,154,0.28)"; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(28, INFO_Y + 54); ctx.lineTo(CW - 28, INFO_Y + 54); ctx.stroke();

  ctx.fillStyle = highlighted ? "#2c1605" : "rgba(52,40,28,0.90)";
  ctx.font = "300 66px Georgia, serif";
  ctx.fillText(meta.label, 24, INFO_Y + 132);

  ctx.fillStyle = "rgba(140,127,116,0.65)";
  ctx.font = "300 13px monospace";
  ctx.fillText(String(count).padStart(2, "0") + " Projects", 28, INFO_Y + 165);

  ctx.strokeStyle = "rgba(181,168,154,0.28)"; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(28, CH - 44); ctx.lineTo(CW - 28, CH - 44); ctx.stroke();

  ctx.fillStyle = highlighted ? meta.colHex : "rgba(140,127,116,0.48)";
  ctx.font = "300 12px monospace";
  ctx.fillText("Enter " + meta.label.toUpperCase() + "  →", 28, CH - 18);

  return new THREE.CanvasTexture(cv);
}

// ─── House scene ──────────────────────────────────────────────────────────────

function HouseScene({ onEnterCategory }: { onEnterCategory: (cat: CatKey) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);
  const onEnterRef   = useRef(onEnterCategory);
  useEffect(() => { onEnterRef.current = onEnterCategory; }, [onEnterCategory]);

  useEffect(() => {
    const container = containerRef.current;
    const hint      = hintRef.current;
    if (!container || !hint) return;

    let mounted = true;
    let internalCleanup: (() => void) | null = null;

    async function init() {
      // Load portal images before building scene
      const [luxImg, premImg, resImg] = await Promise.all([
        loadPortalImage(PORTAL_IMAGES.luxury),
        loadPortalImage(PORTAL_IMAGES["mid-range"]),
        loadPortalImage(PORTAL_IMAGES.economical),
      ]);
      if (!mounted) return;

      const imgMap: Record<CatKey, HTMLImageElement> = {
        luxury: luxImg, "mid-range": premImg, economical: resImg,
      };

      let W = container.clientWidth, H = container.clientHeight;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0xF5EDD9, 1);
      Object.assign(renderer.domElement.style, { position:"absolute",inset:"0",width:"100%",height:"100%" });
      container.prepend(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 3000);
      camera.position.set(0, 30, 820);

      // ── Wireframe house ────────────────────────────────────────────────────
      const HC = 0x7a5c3a, S = 1.55;
      const house = new THREE.Group();
      scene.add(house);

      function em(geo: THREE.BufferGeometry, opacity: number): THREE.LineSegments {
        return new THREE.LineSegments(new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: HC, transparent: true, opacity }));
      }
      function prism(w: number, h: number, d: number): THREE.BufferGeometry {
        const hw = w/2, hd = d/2;
        const v = new Float32Array([-hw,0,-hd, hw,0,-hd, hw,0,hd, -hw,0,hd, 0,h,-hd, 0,h,hd]);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(v, 3));
        g.setIndex([0,1, 1,2, 2,3, 3,0, 0,4, 1,4, 4,5, 5,2, 3,5]);
        return g;
      }

      const parts: [THREE.LineSegments, number, number, number][] = [
        [em(new THREE.BoxGeometry(310*S,  6*S, 160*S), 0.50), -20*S, -94*S,   0],
        [em(new THREE.BoxGeometry(200*S,120*S, 140*S), 0.72),   0*S, -30*S,   0],
        [em(new THREE.BoxGeometry( 88*S, 78*S, 108*S), 0.62),-144*S, -51*S, -14*S],
        [em(new THREE.BoxGeometry( 16*S, 58*S,  16*S), 0.55),  42*S, 118*S, -22*S],
        [em(new THREE.BoxGeometry( 20*S, 36*S,   2*S), 0.45),   8*S, -61*S,  71*S],
        [em(new THREE.BoxGeometry( 70*S, 46*S,   2*S), 0.45),-144*S, -51*S,  56*S],
        [em(new THREE.BoxGeometry( 40*S,  6*S,  16*S), 0.38),   8*S, -88*S,  78*S],
      ];
      [[-66,-18],[66,-18],[-66,-54],[66,-54]].forEach(([x,y]) =>
        parts.push([em(new THREE.BoxGeometry(24*S,20*S,2*S),0.40), x*S, y*S, 71*S]));
      [[-10],[46]].forEach(([y]) =>
        parts.push([em(new THREE.BoxGeometry(2*S,20*S,24*S),0.36), 101*S, y*S, 0]));
      parts.forEach(([m,x,y,z]) => { m.position.set(x,y,z); house.add(m); });

      const mainRoof = new THREE.LineSegments(prism(208*S,78*S,148*S),
        new THREE.LineBasicMaterial({ color:HC, transparent:true, opacity:0.72 }));
      mainRoof.position.y = 30*S; house.add(mainRoof);

      const garRoof = new THREE.LineSegments(prism(96*S,46*S,116*S),
        new THREE.LineBasicMaterial({ color:HC, transparent:true, opacity:0.62 }));
      garRoof.position.set(-144*S,-12*S,-14*S); house.add(garRoof);

      // Breathing animation
      const baseOps = house.children.map(m =>
        ((m as THREE.LineSegments).material as THREE.LineBasicMaterial).opacity ?? 0);
      const bp = { t: 0 };
      gsap.to(bp, { t:1, duration:3.8, yoyo:true, repeat:-1, ease:"sine.inOut",
        onUpdate() {
          house.children.forEach((m,i) => {
            const mat = (m as THREE.LineSegments).material as THREE.LineBasicMaterial;
            if (mat) mat.opacity = baseOps[i] * (0.72 + 0.28 * bp.t);
          });
        }
      });

      // ── Portal cards — 3 even columns, all facing camera ──────────────────
      // Camera is at (0, 30, 820). lookAt for non-camera Object3D makes +z face target.
      const LOOK_AT = new THREE.Vector3(0, 30, 820);

      const PORTAL_DEFS: { key: CatKey; pos: [number,number,number] }[] = [
        { key: "luxury",     pos: [-255, 15, 340] },
        { key: "mid-range",  pos: [   0, 15, 365] },
        { key: "economical", pos: [ 255, 15, 340] },
      ];
      const PW = 170, PH = 240; // 510:720 canvas ratio

      type Portal = {
        key: CatKey; group: THREE.Group; mat: THREE.MeshBasicMaterial;
        borderMat: THREE.LineBasicMaterial; hit: THREE.Mesh;
        hovered: boolean; basePos: [number,number,number];
        img: HTMLImageElement;
      };
      const portals: Portal[] = [];

      PORTAL_DEFS.forEach((def, i) => {
        const group = new THREE.Group();
        group.position.set(...def.pos);
        group.lookAt(LOOK_AT);

        const img = imgMap[def.key];
        const tex = makePortalTexture(def.key, false, img);
        const mat = new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:0, side:THREE.DoubleSide });
        group.add(new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat));

        const borderMat = new THREE.LineBasicMaterial({ color:CAT_META[def.key].col3, transparent:true, opacity:0.50 });
        group.add(new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.PlaneGeometry(PW+1, PH+1)), borderMat));

        const hit = new THREE.Mesh(new THREE.PlaneGeometry(PW+8, PH+8),
          new THREE.MeshBasicMaterial({ transparent:true, opacity:0, side:THREE.DoubleSide }));
        group.add(hit);
        scene.add(group);

        gsap.to(mat, { opacity:0.92, duration:1.2, delay:0.5+i*0.15, ease:"power2.out" });
        gsap.from(group.position, { y:def.pos[1]-30, duration:1.4, delay:0.5+i*0.15, ease:"power3.out" });

        portals.push({ key:def.key, group, mat, borderMat, hit, hovered:false,
          basePos:[...def.pos] as [number,number,number], img });
      });

      // ── Drag — only house rotates ──────────────────────────────────────────
      const MAX_Y = Math.PI * 0.6, MAX_X = 0.55;
      let isDragging = false, velX = 0, velY = 0;
      let tRotX = 0, tRotY = 0, cRotX = 0, cRotY = 0;
      let prevX = 0, prevY = 0, gmx = W/2, gmy = H/2;
      let hintGone = false;
      const rc = new THREE.Raycaster(), m2 = new THREE.Vector2();

      const onMD = (e: MouseEvent) => {
        isDragging = true; prevX = e.clientX; prevY = e.clientY;
        if (!hintGone) { hint.style.opacity = "0"; hintGone = true; }
      };
      const onMU = () => { isDragging = false; };
      const onMM = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        gmx = e.clientX - r.left; gmy = e.clientY - r.top;
        if (!isDragging) return;
        const dx = e.clientX-prevX, dy = e.clientY-prevY;
        velX = dx*0.004; velY = dy*0.004;
        tRotY = Math.max(-MAX_Y, Math.min(MAX_Y, tRotY+dx*0.004));
        tRotX = Math.max(-MAX_X, Math.min(MAX_X, tRotX+dy*0.003));
        prevX = e.clientX; prevY = e.clientY;
      };
      const onCk = (e: MouseEvent) => {
        if (Math.abs(velX)>0.01 || Math.abs(velY)>0.01) return;
        const r = container.getBoundingClientRect();
        m2.x = ((e.clientX-r.left)/W)*2-1;
        m2.y = -((e.clientY-r.top)/H)*2+1;
        rc.setFromCamera(m2, camera);
        const hits = rc.intersectObjects(portals.map(p=>p.hit));
        if (hits.length) {
          const p = portals.find(x=>x.hit===hits[0].object);
          if (p) onEnterRef.current(p.key);
        }
      };
      let touchMoveDist = 0;
      let touchHoveredKey: CatKey | null = null;

      const onTS = (e: TouchEvent) => {
        isDragging = true;
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
        touchMoveDist = 0;
        if (!hintGone) { hint.style.opacity = "0"; hintGone = true; }
      };
      const onTE = (e: TouchEvent) => {
        isDragging = false;
        // Treat as a tap if the finger barely moved
        if (touchMoveDist < 8 && e.changedTouches.length) {
          const t = e.changedTouches[0];
          const r = container.getBoundingClientRect();
          m2.x = ((t.clientX - r.left) / W) * 2 - 1;
          m2.y = -((t.clientY - r.top)  / H) * 2 + 1;
          rc.setFromCamera(m2, camera);
          const hits = rc.intersectObjects(portals.map(p => p.hit));
          if (hits.length) {
            const portal = portals.find(x => x.hit === hits[0].object);
            if (portal) {
              if (touchHoveredKey === portal.key) {
                // second tap on same portal → enter
                onEnterRef.current(portal.key);
                touchHoveredKey = null;
              } else {
                // first tap → hover-in animation
                touchHoveredKey = portal.key;
                gmx = t.clientX - r.left;
                gmy = t.clientY - r.top;
              }
            }
          } else {
            touchHoveredKey = null;
          }
        }
      };
      const onTM = (e: TouchEvent) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - prevX, dy = e.touches[0].clientY - prevY;
        touchMoveDist += Math.abs(dx) + Math.abs(dy);
        velX = dx * 0.004; velY = dy * 0.004;
        tRotY = Math.max(-MAX_Y, Math.min(MAX_Y, tRotY + dx * 0.004));
        tRotX = Math.max(-MAX_X, Math.min(MAX_X, tRotX + dy * 0.003));
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      };
      const onRz = () => {
        W = container.clientWidth; H = container.clientHeight;
        renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
      };

      container.addEventListener("mousedown", onMD);
      window.addEventListener("mouseup", onMU);
      window.addEventListener("mousemove", onMM);
      container.addEventListener("click", onCk);
      container.addEventListener("touchstart", onTS, { passive:true });
      window.addEventListener("touchend", onTE);
      window.addEventListener("touchmove", onTM, { passive:true });
      window.addEventListener("resize", onRz);

      function checkHover() {
        m2.x=(gmx/W)*2-1; m2.y=-(gmy/H)*2+1;
        rc.setFromCamera(m2, camera);
        const hits = rc.intersectObjects(portals.map(p=>p.hit));
        const hitObj = hits.length ? hits[0].object : null;
        portals.forEach(p => {
          const isH = p.hit === hitObj;
          if (isH && !p.hovered) {
            p.hovered = true;
            p.mat.map = makePortalTexture(p.key, true, p.img);
            p.mat.map.needsUpdate = true;
            gsap.to(p.group.position, { y:p.basePos[1]+12, duration:0.5, ease:"power2.out" });
            gsap.to(p.group.scale,    { x:1.06, y:1.06, duration:0.5, ease:"power2.out" });
            gsap.to(p.borderMat,      { opacity:1, duration:0.35 });
            portals.forEach(o => { if (o.key!==p.key) { gsap.to(o.mat,{opacity:0.35,duration:0.4}); gsap.to(o.borderMat,{opacity:0.15,duration:0.4}); } });
          } else if (!isH && p.hovered) {
            p.hovered = false;
            p.mat.map = makePortalTexture(p.key, false, p.img);
            p.mat.map.needsUpdate = true;
            gsap.to(p.group.position, { y:p.basePos[1], duration:0.5, ease:"power2.out" });
            gsap.to(p.group.scale,    { x:1, y:1, duration:0.5, ease:"power2.out" });
            gsap.to(p.borderMat,      { opacity:0.50, duration:0.35 });
            portals.forEach(o => { gsap.to(o.mat,{opacity:0.92,duration:0.4}); gsap.to(o.borderMat,{opacity:0.50,duration:0.4}); });
          }
        });
      }

      let frameId: number;
      (function loop() {
        frameId = requestAnimationFrame(loop);
        if (!isDragging) {
          velX*=0.93; velY*=0.93;
          tRotY = Math.max(-MAX_Y, Math.min(MAX_Y, tRotY+velX+0.0005));
          tRotX = Math.max(-MAX_X, Math.min(MAX_X, tRotX+velY));
        }
        cRotX+=(tRotX-cRotX)*0.06; cRotY+=(tRotY-cRotY)*0.06;
        house.rotation.x = cRotX; house.rotation.y = cRotY;
        checkHover();
        renderer.render(scene, camera);
      })();

      internalCleanup = () => {
        cancelAnimationFrame(frameId);
        container.removeEventListener("mousedown", onMD);
        window.removeEventListener("mouseup", onMU);
        window.removeEventListener("mousemove", onMM);
        container.removeEventListener("click", onCk);
        container.removeEventListener("touchstart", onTS);
        window.removeEventListener("touchend", onTE);
        window.removeEventListener("touchmove", onTM);
        window.removeEventListener("resize", onRz);
        gsap.killTweensOf(bp);
        portals.forEach(p => {
          gsap.killTweensOf(p.mat); gsap.killTweensOf(p.group.position);
          gsap.killTweensOf(p.group.scale); gsap.killTweensOf(p.borderMat);
        });
        renderer.dispose(); renderer.domElement.remove();
      };
    }

    init();
    return () => { mounted = false; internalCleanup?.(); };
  }, []);

  return (
    <div ref={containerRef} style={{ position:"relative",width:"100%",height:"88vh",cursor:"none",overflow:"hidden" }}>
      <div ref={hintRef} style={{ position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"opacity .8s",pointerEvents:"none" }}>
        <div style={{ width:40,height:40,borderRadius:"50%",border:"0.5px solid rgba(71,55,39,0.25)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="rgba(71,55,39,0.35)" strokeWidth=".8"/>
            <path d="M6 9h6M9 6l3 3-3 3" stroke="rgba(71,55,39,0.35)" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontSize:"0.52rem",color:"rgba(71,55,39,0.38)",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"Inter,sans-serif" }}>
          Drag to explore · Tap to enter a collection
        </p>
      </div>
    </div>
  );
}

// ─── Category letter scene ────────────────────────────────────────────────────

function CatLetterScene({ categoryKey }: { categoryKey: CatKey }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    let W = container.clientWidth, H = container.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0x000000,0);
    Object.assign(renderer.domElement.style, { position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"2" });
    container.prepend(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50,W/H,0.1,3000);
    camera.position.set(0,20,600);

    const meta = CAT_META[categoryKey], col = meta.col3;
    function em(geo: THREE.BufferGeometry, op: number) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color:col, transparent:true, opacity:op }));
    }

    const word = meta.label.toUpperCase();
    const lG   = new THREE.Group(); scene.add(lG);
    const lW=55, lH=90, lD=28, gap=14;
    const totalW = word.length*(lW+gap)-gap;
    const startX = -totalW/2+lW/2;

    word.split("").forEach((_,i) => {
      const lx = startX+i*(lW+gap);
      const outer = em(new THREE.BoxGeometry(lW,lH,lD), 0.75); outer.position.set(lx,0,0); lG.add(outer);
      const inner = em(new THREE.BoxGeometry(lW-8,lH-8,lD+4), 0.28); inner.position.set(lx,0,0); lG.add(inner);
      const cap   = em(new THREE.BoxGeometry(lW,4,lD*1.2), 0.52); cap.position.set(lx,lH/2+2,0); lG.add(cap);
    });

    for (let i=-3;i<=3;i++) {
      const gl = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(totalW+120,1,400)),
        new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.05+Math.abs(i)*0.01}));
      gl.position.set(0,-lH/2-20+i*60,0); scene.add(gl);
    }
    [-totalW/2-40,-totalW/2,0,totalW/2,totalW/2+40].forEach(x => {
      const vl = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,300,1)),
        new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.07}));
      vl.position.set(x,0,-60); scene.add(vl);
    });

    lG.position.set(-totalW*0.15,-20,-40); lG.rotation.y=0.12;
    gsap.from(lG.rotation, { y:0.45,duration:2.2,ease:"power3.out",delay:0.3 });
    gsap.from(lG.position,  { x:lG.position.x-80,duration:2,ease:"power3.out",delay:0.3 });
    lG.children.forEach((m,i) => {
      const mat = (m as THREE.LineSegments).material as THREE.LineBasicMaterial;
      if (mat) { const op=mat.opacity; mat.opacity=0; gsap.to(mat,{opacity:op,duration:1.2,delay:0.2+i*0.025,ease:"power2.out"}); }
    });

    const proxy={ry:0.12};
    gsap.to(proxy,{ry:0.04,duration:6,yoyo:true,repeat:-1,ease:"sine.inOut",onUpdate(){lG.rotation.y=proxy.ry;}});

    const onMM = (e: MouseEvent) => {
      gsap.to(camera.position,{x:(e.clientX/window.innerWidth-0.5)*30,y:20+(e.clientY/window.innerHeight-0.5)*15,duration:1.8,ease:"power2.out"});
    };
    // Touch: finger drag drifts the camera the same way mouse does
    const onTM = (e: TouchEvent) => {
      const t = e.touches[0];
      gsap.to(camera.position,{x:(t.clientX/window.innerWidth-0.5)*30,y:20+(t.clientY/window.innerHeight-0.5)*15,duration:1.8,ease:"power2.out"});
    };
    // Gyroscope: device tilt drifts camera (iOS needs permission — granted via hero section touch)
    const onOri = (e: DeviceOrientationEvent) => {
      const gx = ((e.gamma ?? 0) / 45) * 15;
      const gy = 20 + ((e.beta  ?? 0) / 45) * 7.5;
      gsap.to(camera.position,{x:gx,y:gy,duration:2,ease:"power2.out"});
    };
    const onRz = () => { W=container.clientWidth; H=container.clientHeight; renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix(); };
    window.addEventListener("mousemove",onMM);
    window.addEventListener("touchmove",onTM,{passive:true});
    window.addEventListener("deviceorientation",onOri,{passive:true});
    window.addEventListener("resize",onRz);

    let fId: number;
    (function loop(){fId=requestAnimationFrame(loop); renderer.render(scene,camera);})();

    return () => {
      cancelAnimationFrame(fId);
      window.removeEventListener("mousemove",onMM);
      window.removeEventListener("touchmove",onTM);
      window.removeEventListener("deviceorientation",onOri);
      window.removeEventListener("resize",onRz);
      gsap.killTweensOf(proxy); gsap.killTweensOf(lG.rotation); gsap.killTweensOf(lG.position);
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [categoryKey]);

  return <div ref={containerRef} style={{ position:"absolute",inset:0 }} />;
}

// ─── Category page (fixed overlay) ───────────────────────────────────────────

function CategoryView({ category, onBack, onProjectClick, onProjectHover }: {
  category: CatKey; onBack: () => void;
  onProjectClick: (p: Project) => void;
  onProjectHover: (p: Project | null) => void;
}) {
  const meta        = CAT_META[category];
  const catProjects = projects.filter(p => p.category === category);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => { document.body.style.overflow="hidden"; return ()=>{document.body.style.overflow="";} }, []);

  useLayoutEffect(() => {
    gsap.fromTo(eyebrowRef.current,{opacity:0},{opacity:1,duration:0.9,delay:0.4,ease:"power2.out"});
    gsap.fromTo(titleRef.current,  {opacity:0},{opacity:1,duration:1.1,delay:0.55,ease:"power2.out"});
    gsap.fromTo(subRef.current,    {opacity:0},{opacity:1,duration:0.9,delay:0.75,ease:"power2.out"});
  }, []);

  useLayoutEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".cproj");
    if (!cards?.length) return;
    gsap.fromTo(cards,{y:40,autoAlpha:0},{y:0,autoAlpha:1,stagger:0.1,duration:0.8,delay:0.2,ease:"power3.out"});
  }, []);

  return (
    <div data-lenis-prevent style={{ position:"fixed",inset:0,zIndex:1000,background:"#FCFAF5",overflowY:"auto",overscrollBehavior:"contain" }}>
      <button onClick={onBack} style={{ position:"fixed",top:26,left:48,zIndex:1100,display:"flex",alignItems:"center",gap:8,fontSize:"0.55rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(71,55,39,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"color .25s" }}
        onMouseEnter={e=>(e.currentTarget.style.color="#473727")}
        onMouseLeave={e=>(e.currentTarget.style.color="rgba(71,55,39,0.6)")}
      >
        <ArrowLeft style={{width:14,height:14}} /> Back
      </button>

      {/* Hero with 3D letters */}
      <div style={{ position:"relative",width:"100%",height:"65vh",overflow:"hidden",flexShrink:0 }}>
        <video key={CAT_VIDEO[category]} autoPlay muted loop playsInline style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0 }}>
          <source src={CAT_VIDEO[category]} type="video/mp4" />
        </video>
        <div style={{ position:"absolute",inset:0,background:"rgba(245,237,217,0.45)",zIndex:1 }} />
        <CatLetterScene categoryKey={category} />
        <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"60px 64px",pointerEvents:"none",zIndex:3 }}>
          <div ref={eyebrowRef} style={{ opacity:0,fontSize:"0.5rem",letterSpacing:"0.3em",color:"rgba(71,55,39,0.6)",textTransform:"uppercase",marginBottom:12,fontFamily:"Inter,sans-serif" }}>
            SV Developers — {meta.tag}
          </div>
          <div ref={titleRef} className="font-display" style={{ opacity:0,fontSize:"clamp(3rem,8vw,7rem)",fontWeight:300,lineHeight:0.95,color:"#1C0D07",letterSpacing:"-0.01em" }}>
            {meta.label}<br/><span style={{ fontStyle:"italic",color:"#BE9234" }}>Collection</span>
          </div>
          <div ref={subRef} style={{ opacity:0,fontSize:"0.58rem",letterSpacing:"0.14em",color:"rgba(71,55,39,0.52)",textTransform:"uppercase",marginTop:18,fontFamily:"Inter,sans-serif" }}>
            {meta.sub}
          </div>
        </div>
        <div style={{ position:"absolute",right:52,bottom:52,display:"flex",flexDirection:"column",alignItems:"center",gap:10,zIndex:3 }}>
          <span style={{ fontSize:"0.45rem",letterSpacing:"0.2em",color:"rgba(71,55,39,0.45)",textTransform:"uppercase",writingMode:"vertical-rl",fontFamily:"Inter,sans-serif" }}>Scroll</span>
          <div style={{ width:1,height:50,background:"linear-gradient(to bottom,rgba(71,55,39,0.45),transparent)" }} />
        </div>
      </div>

      {/* Project grid */}
      <div style={{ padding:"80px 48px 120px" }}>
        <div style={{ display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:52,paddingBottom:20,borderBottom:"1px solid rgba(71,55,39,0.12)" }}>
          <h2 className="font-heading" style={{ fontSize:"clamp(1.4rem,3vw,2rem)",fontWeight:300,color:"#1C0D07" }}>
            Selected <em style={{ fontStyle:"italic",color:"#BE9234" }}>Works</em>
          </h2>
          <span style={{ fontSize:"0.5rem",letterSpacing:"0.16em",color:"rgba(71,55,39,0.50)",textTransform:"uppercase",fontFamily:"Inter,sans-serif" }}>
            {String(catProjects.length).padStart(2,"0")} Projects
          </span>
        </div>

        <div ref={gridRef} style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))",gap:2,background:"rgba(71,55,39,0.08)" }}>
          {catProjects.map((p,i) => (
            <div key={p.id} className="cproj"
              onClick={()=>onProjectClick(p)}
              onMouseEnter={()=>onProjectHover(p)}
              onMouseLeave={()=>onProjectHover(null)}
              onTouchStart={()=>onProjectHover(p)}
              onTouchEnd={()=>setTimeout(()=>onProjectHover(null),350)}
              style={{ background:"#FCFAF5",cursor:"pointer",overflow:"hidden",transition:"background .4s var(--ease-lux)" }}
            >
              <div style={{ width:"100%",aspectRatio:"4/3",overflow:"hidden",background:"rgba(71,55,39,0.06)" }}>
                <img src={p.image} alt={p.name} loading="lazy" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .9s cubic-bezier(.16,1,.3,1)" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLImageElement).style.transform="scale(1.06)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLImageElement).style.transform="scale(1)";}}
                  onTouchStart={e=>{(e.currentTarget as HTMLImageElement).style.transform="scale(1.06)";}}
                  onTouchEnd={e=>{setTimeout(()=>{(e.currentTarget as HTMLImageElement).style.transform="scale(1)";},350);}}
                />
              </div>
              <div style={{ padding:"22px 24px 26px" }}>
                <div style={{ fontSize:"0.48rem",letterSpacing:"0.2em",color:"rgba(71,55,39,0.45)",textTransform:"uppercase",marginBottom:8,fontFamily:"Inter,sans-serif" }}>
                  {String(i+1).padStart(2,"0")}
                </div>
                <div className="font-heading" style={{ fontSize:"1.35rem",fontWeight:300,color:"#1C0D07",lineHeight:1.1,marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:"0.52rem",letterSpacing:"0.1em",color:"rgba(71,55,39,0.58)",textTransform:"uppercase",fontFamily:"Inter,sans-serif" }}>{p.type}</div>
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:14,borderTop:"1px solid rgba(71,55,39,0.09)" }}>
                  <span style={{ fontSize:"0.48rem",letterSpacing:"0.12em",color:"rgba(71,55,39,0.45)",fontFamily:"Inter,sans-serif" }}>{p.status}</span>
                  <span style={{ fontSize:"0.48rem",letterSpacing:"0.12em",color:"rgba(71,55,39,0.45)",fontFamily:"Inter,sans-serif" }}>{p.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Projects page ────────────────────────────────────────────────────────────

export default function Projects() {
  const [view,        setView]        = useState<"main"|"category">("main");
  const [activeCat,   setActiveCat]   = useState<CatKey|null>(null);
  const [modalProject,   setModalProject]   = useState<Project|null>(null); // click → centered modal
  const [previewProject, setPreviewProject] = useState<Project|null>(null); // hover → side panel
  const [vigOpacity,  setVigOpacity]  = useState(0);

  // Deep-link support: ?cat=luxury&project=3
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat    = params.get("cat") as CatKey | null;
    const projId = params.get("project");
    if (!cat || !CAT_META[cat]) return;
    setActiveCat(cat);
    setView("category");
    if (projId) {
      const proj = projects.find(p => String(p.id) === projId);
      if (proj) {
        const t = setTimeout(() => setModalProject(proj), 500);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const transition = (fn: ()=>void) => {
    setVigOpacity(1);
    setTimeout(()=>{ fn(); setTimeout(()=>setVigOpacity(0), 80); }, 550);
  };
  const enterCat = (cat: CatKey) => transition(()=>{ setActiveCat(cat); setView("category"); });
  const exitCat  = ()            => transition(()=>{ setView("main"); setActiveCat(null); setPreviewProject(null); setModalProject(null); });

  // Click opens the full modal; clear any hover preview underneath it.
  const openModal = (p: Project) => { setPreviewProject(null); setModalProject(p); };

  return (
    <>
      {/* Hover preview — side panel (hidden while the click-modal is open) */}
      <DetailPanel project={modalProject ? null : previewProject} onClose={()=>setPreviewProject(null)} />

      {/* Click — centered full-detail modal */}
      <ProjectModal project={modalProject} onClose={()=>setModalProject(null)} />

      {/* Vignette */}
      <div style={{ position:"fixed",inset:0,zIndex:5000,background:"#FCFAF5",opacity:vigOpacity,pointerEvents:vigOpacity>0.05?"all":"none",transition:"opacity 0.5s ease" }} />

      {view==="category" && activeCat ? (
        <CategoryView category={activeCat} onBack={exitCat} onProjectClick={openModal} onProjectHover={setPreviewProject} />
      ) : (
        <div style={{ minHeight:"100vh",background:"#FCFAF5" }}>

          {/* Page title */}
          <div className="relative overflow-hidden" style={{ background:"#F2EADC",borderBottom:"1px solid rgba(71,55,39,0.12)" }}>
            <span className="pointer-events-none absolute -bottom-8 -right-2 font-heading leading-none select-none" style={{ fontSize:"28vw",color:"rgba(71,55,39,0.05)" }}>P</span>
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-40 pb-14 relative z-10">
              <p className="section-label font-body mb-8" style={{ color:"rgba(71,55,39,0.45)" }}>Est. 2013 · Bengaluru</p>
              <h1 className="font-display leading-[0.88]" style={{ fontSize:"clamp(3.5rem,11vw,9rem)",color:"#1C0D07" }}>
                Selected<br/>
                <span className="italic font-normal" style={{ color:"#BE9234" }}>Projects</span>
              </h1>
              <p style={{ marginTop:24,fontSize:"0.68rem",color:"rgba(71,55,39,0.50)",letterSpacing:"0.1em",fontFamily:"Inter,sans-serif" }}>
                Enter a collection below to explore our portfolio
              </p>
            </div>
          </div>

          {/* House + portals */}
          <HouseScene onEnterCategory={enterCat} />

        </div>
      )}
    </>
  );
}
