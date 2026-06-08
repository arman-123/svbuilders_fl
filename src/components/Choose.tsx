import { Award, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import Reveal from "@/components/Reveal";

const reasons = [
  {
    icon: Award,
    title: "12+ Years of Trusted Delivery",
    description:
      "Delivering consistent and reliable projects for over a decade across Bengaluru and Andhra Pradesh.",
  },
  {
    icon: MapPin,
    title: "Strong Regional Presence",
    description:
      "Growing footprint with successful developments across key regions — AP and Karnataka.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Documentation",
    description:
      "All projects follow clear and verified legal documentation with full RERA compliance.",
  },
  {
    icon: Sparkles,
    title: "Modern Design, Quality Materials",
    description:
      "We use durable materials and innovative design practices in every development.",
  },
  {
    icon: Users,
    title: "Customer-First Approach",
    description:
      "Ensuring satisfaction through dedicated service, responsive communication, and on-time delivery.",
  },
];

export default function Choose() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(210,198,182,0.88)" }} />
      </div>

      {/* Watermark */}
      <span className="pointer-events-none absolute -bottom-6 -left-2 font-heading text-[22vw] leading-none text-[#473727]/[0.06] select-none">
        Trust
      </span>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-20 sm:mb-24">
            <Reveal>
              <p className="section-label text-[#473727]/50 mb-5 font-body">Our Commitment</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#1C0D07] leading-[1.02]">
                Why Choose
                <br />
                <span className="italic font-normal text-[#BE9234]">Us</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-[#5C3718]/60 text-base sm:text-lg font-libre leading-relaxed mt-7 max-w-xl">
                We deliver reliability, quality, and customer-focused development backed by years of proven success.
              </p>
            </Reveal>
          </div>

          {/* Editorial list */}
          <div className="divide-y divide-[#473727]/12">
            {reasons.map((reason, idx) => (
              <Reveal key={reason.title} delay={idx * 60}>
                <div
                  className="group flex items-start gap-6 sm:gap-10 py-8 sm:py-10 hover:pl-3 active:pl-3 transition-all duration-500"
                  onTouchStart={e => e.currentTarget.classList.add("group-touch")}
                  onTouchEnd={e => { const el = e.currentTarget; setTimeout(() => el.classList.remove("group-touch"), 400); }}
                >

                  {/* Number */}
                  <span className="font-heading text-4xl sm:text-5xl text-[#473727]/15 leading-none w-14 flex-shrink-0 group-hover:text-[#473727]/30 transition-colors duration-500 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="w-11 h-11 border border-[#473727]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#473727] group-hover:border-[#473727] transition-all duration-500">
                    <reason.icon className="w-5 h-5 text-[#5C3718]/60 group-hover:text-[#E8DCC8] transition-colors duration-500" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-0.5">
                    <h3 className="font-heading text-xl sm:text-2xl text-[#3D1F0E]/80 mb-2.5 group-hover:text-[#1C0D07] transition-colors duration-400">
                      {reason.title}
                    </h3>
                    <p className="text-[#5C3718]/55 text-sm sm:text-base leading-relaxed font-libre group-hover:text-[#5C3718]/80 transition-colors duration-400">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
