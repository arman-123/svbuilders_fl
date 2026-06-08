import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, X, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useTouchDevice } from "@/hooks/use-touch-device";

const services = [
  {
    id: 1,
    title: "Construction",
    description:
      "End-to-end construction services with quality craftsmanship and timely delivery for residential and commercial projects.",
    fullDescription:
      "Our comprehensive construction services deliver excellence from blueprint to completion. With decades of experience and a team of skilled professionals, we ensure every project meets the highest standards of quality, safety, and sustainability.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    keyPoints: [
      "Expert project management from start to finish",
      "Quality materials and superior craftsmanship",
      "On-time delivery with transparent communication",
      "Compliance with all safety and building regulations",
      "Cost-effective solutions without compromising quality",
      "Experienced workforce with modern equipment",
    ],
  },
  {
    id: 2,
    title: "Apartments",
    description:
      "Premium apartment complexes designed for modern living with world-class amenities and sustainable features.",
    fullDescription:
      "Experience elevated urban living in our thoughtfully designed apartment complexes. Each property combines contemporary architecture with sustainable practices, offering residents a perfect blend of comfort, convenience, and community.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
    keyPoints: [
      "Modern architectural design with premium finishes",
      "World-class amenities including gym, pool, and clubhouse",
      "Smart home integration and energy-efficient systems",
      "24/7 security with gated community access",
      "Ample parking and green spaces",
      "Prime locations with excellent connectivity",
    ],
  },
  {
    id: 3,
    title: "Townships",
    description:
      "Integrated township development with residential, commercial, and recreational spaces for complete urban living.",
    fullDescription:
      "Our integrated townships redefine community living by creating self-sustained ecosystems that combine residential, commercial, and recreational facilities. These developments are designed to provide everything you need within walking distance.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    keyPoints: [
      "Mixed-use development with residential and commercial zones",
      "Schools, hospitals, and shopping centers within premises",
      "Parks, playgrounds, and recreational facilities",
      "Sustainable infrastructure with waste management systems",
      "Wide roads, street lighting, and landscaped boulevards",
      "Community centers and social gathering spaces",
    ],
  },
  {
    id: 4,
    title: "Layouts",
    description:
      "Well-planned residential and commercial layouts with proper infrastructure, utilities, and legal approvals.",
    fullDescription:
      "Invest in perfectly planned plots with complete infrastructure and legal documentation. Our layouts are designed with attention to detail, ensuring optimal land utilization and future appreciation potential.",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2070&auto=format&fit=crop",
    keyPoints: [
      "RERA approved with clear legal documentation",
      "Well-designed plot layouts with proper road access",
      "Underground drainage and water supply systems",
      "Electricity connections and street lighting",
      "Compound walls and entrance gates",
      "Parks and community spaces within layout",
    ],
  },
  {
    id: 5,
    title: "Villas",
    description:
      "Luxurious independent villas with contemporary architecture, private gardens, and premium finishes.",
    fullDescription:
      "Live the life of luxury in our exclusive villas that offer privacy, space, and elegance. Each villa is a masterpiece of architectural design, featuring premium amenities and finishes that cater to discerning homeowners.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    keyPoints: [
      "Spacious independent villas with private gardens",
      "Contemporary architecture with premium interiors",
      "High-end fixtures and branded fittings",
      "Private parking and security systems",
      "Customization options available",
      "Gated community with exclusive amenities",
    ],
  },
  {
    id: 6,
    title: "Real Estate Marketing",
    description:
      "Strategic property marketing solutions to maximize visibility and accelerate sales for your real estate projects.",
    fullDescription:
      "Elevate your real estate projects with our comprehensive marketing solutions. We combine digital innovation with traditional strategies to create compelling campaigns that drive results and maximize ROI.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
    keyPoints: [
      "Digital marketing campaigns across all platforms",
      "Professional photography and virtual tours",
      "Strategic branding and positioning",
      "Lead generation and CRM management",
      "Event management and property launches",
      "Performance analytics and reporting",
    ],
  },
];

export default function Services() {
  const [selected, setSelected] = useState<(typeof services)[0] | null>(null);
  const [tappedId, setTappedId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const isTouch = useTouchDevice();

  /* ── Spotlight — mouse (desktop) + touch (mobile) ── */
  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = 0, active = false;

    const updatePos = (clientX: number, clientY: number) => {
      const r = section.getBoundingClientRect();
      tx = clientX - r.left;
      ty = clientY - r.top;
      if (!active) { active = true; spotlight.style.opacity = "1"; }
    };

    const onMove  = (e: MouseEvent)  => updatePos(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent)  => updatePos(e.touches[0].clientX, e.touches[0].clientY);
    const onLeave = () => { active = false; spotlight.style.opacity = "0"; };

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      spotlight.style.background = `radial-gradient(650px circle at ${cx}px ${cy}px, rgba(71,55,39,0.10) 0%, transparent 65%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 sm:py-32 lg:py-40 bg-[#e8e0d4] overflow-hidden"
    >
      {/* Mouse spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0, transition: "opacity 0.5s ease" }}
      />

      {/* Background watermark */}
      <span className="pointer-events-none absolute top-0 left-0 font-heading text-[20vw] leading-none text-[#473727]/[0.05] select-none">
        Services
      </span>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="mb-20 sm:mb-24 lg:mb-28">
          <Reveal>
            <p className="section-label text-[#5C3718]/60 mb-5 font-body">What We Offer</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#1C0D07] leading-[1.02]">
              Our
              <br />
              <span className="italic font-normal text-[#BE9234]">Services</span>
            </h2>
          </Reveal>
        </div>

        {/* Editorial service list */}
        <div className="divide-y divide-[#473727]/12">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 50}>
              <div
                className="group relative py-7 sm:py-8 flex items-start sm:items-center justify-between gap-6 cursor-pointer"
                onClick={() => {
                  if (isTouch) {
                    if (tappedId === service.id) {
                      // second tap → open modal
                      setSelected(service);
                      setTappedId(null);
                    } else {
                      // first tap → reveal description + snap spotlight
                      setTappedId(service.id);
                      const el = sectionRef.current?.querySelector(`[data-sid="${service.id}"]`) as HTMLElement;
                      if (el && spotlightRef.current) {
                        const r = sectionRef.current!.getBoundingClientRect();
                        const er = el.getBoundingClientRect();
                        const cx = er.left + er.width / 2 - r.left;
                        const cy = er.top  + er.height / 2 - r.top;
                        spotlightRef.current.style.opacity = "1";
                        spotlightRef.current.style.background = `radial-gradient(650px circle at ${cx}px ${cy}px, rgba(71,55,39,0.10) 0%, transparent 65%)`;
                      }
                    }
                  } else {
                    setSelected(service);
                  }
                }}
                data-sid={service.id}
              >
                {/* Index */}
                <span className="font-heading text-[0.72rem] text-[#5C3718]/35 tracking-widest w-10 flex-shrink-0 pt-1 sm:pt-0 group-hover:text-[#5C3718]/55 transition-colors duration-500">
                  {String(service.id).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#3D1F0E]/80 flex-1 transition-all duration-500 group-hover:text-[#1C0D07] group-hover:translate-x-2">
                  {service.title}
                </h3>

                {/* Description — always visible on desktop; revealed on first tap on mobile */}
                <p
                  className="text-[#5C3718]/60 text-sm font-libre leading-relaxed max-w-xs transition-all duration-500 group-hover:text-[#3D1F0E]/70"
                  style={{
                    display: isTouch ? (tappedId === service.id ? "block" : "none") : undefined,
                  }}
                  // on desktop keep the existing hidden lg:block class
                  {...(!isTouch && { className: "text-[#5C3718]/60 text-sm font-libre leading-relaxed max-w-xs hidden lg:block transition-colors duration-500 group-hover:text-[#3D1F0E]/70" })}
                >
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="flex-shrink-0 w-9 h-9 border border-[#473727]/20 flex items-center justify-center transition-all duration-500 group-hover:bg-[#473727] group-hover:border-[#473727]">
                  <ArrowUpRight className="w-4 h-4 text-[#5C3718]/55 group-hover:text-[#E8DCC8] transition-colors duration-500" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <a
              href="/#contact"
              className="btn-fill inline-flex items-center gap-2.5 px-9 py-4 bg-[#473727] text-[#E8DCC8] font-body font-medium text-[0.7rem] tracking-[0.2em] uppercase"
            >
              Discuss Your Project
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-[#0a0906]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            data-lenis-prevent
            className="relative bg-[#faf8f5] max-w-4xl w-full max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-[#E8DCC8] hover:bg-[#d5c9b0] flex items-center justify-center transition-all duration-300 z-10"
            >
              <X className="w-4 h-4 text-[#473727]" />
            </button>

            {/* Image */}
            <div className="relative h-56 sm:h-72 md:h-88 overflow-hidden">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-full object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906]/90 via-[#0a0906]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 sm:p-9">
                <span className="font-heading text-6xl text-[#5C3718]/25 leading-none">
                  {String(selected.id).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl text-[#1C0D07] mt-1">
                  {selected.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 sm:p-9 md:p-11">
              <div className="mb-8">
                <p className="section-label text-[#473727]/50 mb-4 font-body">Overview</p>
                <p className="text-[#3a3028]/70 text-base sm:text-lg leading-[1.85] font-libre">
                  {selected.fullDescription}
                </p>
              </div>

              <div>
                <p className="section-label text-[#473727]/50 mb-5 font-body">Key Features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-[#f0ebe3] hover:bg-[#e8e0d4] transition-colors duration-300">
                      <CheckCircle2 className="w-4 h-4 text-[#473727] flex-shrink-0 mt-0.5" />
                      <p className="text-[#3a3028]/75 text-sm leading-relaxed font-libre">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-9 pt-7 border-t border-[#473727]/10 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/#contact"
                  onClick={() => setSelected(null)}
                  className="btn-fill inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#473727] text-[#E8DCC8] font-body font-medium text-[0.7rem] tracking-[0.18em] uppercase"
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center justify-center px-9 py-4 border border-[#473727]/20 text-[#473727]/70 hover:bg-[#473727]/06 font-body font-medium text-[0.7rem] tracking-[0.18em] uppercase transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
