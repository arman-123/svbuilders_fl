import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";

const steps = [
  { id: 1, title: "Raise a Request", active: true },
  { id: 2, title: "Meet our Expert", active: true },
  { id: 3, title: "Book with Us", active: true },
  { id: 4, title: "Receive Designs", active: false },
  { id: 5, title: "Track & Transact", active: false },
  { id: 6, title: "Settle In", active: false },
];

export default function Work() {
  return (
    <section
      id="work"
      className="relative py-24 sm:py-32 lg:py-40 bg-[#FAF6EE] overflow-hidden"
    >
      {/* Blueprint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#473727 1px,transparent 1px),linear-gradient(90deg,#473727 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Watermark */}
      <span className="pointer-events-none absolute top-0 right-0 font-heading text-[20vw] leading-none text-[#473727]/[0.03] select-none">
        Process
      </span>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10 relative">

        {/* Header */}
        <div className="mb-20 sm:mb-24">
          <Reveal>
            <p className="section-label text-[#473727]/45 mb-5 font-body">How It Works</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#0f0d0a] leading-[1.02]">
              Our
              <br />
              <span className="italic font-normal text-[#BE9234]">Process</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-[#3a3028]/55 text-base sm:text-lg font-libre leading-relaxed mt-7 max-w-xl">
              Simple, transparent, and customer-focused — from first conversation to final handover.
            </p>
          </Reveal>
        </div>

        {/* Desktop timeline */}
        <Reveal>
          <div className="hidden md:block relative mb-20 sm:mb-24">
            <div
              className="absolute top-5 border-t border-dashed border-[#473727]/20"
              style={{ left: "8.33%", right: "8.33%" }}
            />
            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center font-heading text-sm mb-4 relative z-10 border transition-all duration-500 ${
                      step.active
                        ? "bg-[#473727] border-[#473727] text-[#E8DCC8]"
                        : "bg-[#FAF6EE] border-[#473727]/20 text-[#473727]/30"
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {step.id}
                  </div>
                  <h3
                    className={`font-body text-center text-xs tracking-[0.12em] uppercase ${
                      step.active ? "text-[#473727]" : "text-[#473727]/30"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Mobile timeline */}
        <div className="md:hidden mb-16 space-y-5">
          {steps.map((step, idx) => (
            <Reveal key={step.id} delay={idx * 60}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-9 h-9 flex items-center justify-center font-heading text-sm border ${
                    step.active
                      ? "bg-[#473727] border-[#473727] text-[#E8DCC8]"
                      : "bg-transparent border-[#473727]/20 text-[#473727]/30"
                  }`}
                >
                  {step.id}
                </div>
                <h3
                  className={`font-body text-sm tracking-[0.12em] uppercase ${
                    step.active ? "text-[#473727]" : "text-[#473727]/30"
                  }`}
                >
                  {step.title}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 3D house model */}
        <Reveal variant="scale" delay={100}>
          <div className="max-w-5xl mx-auto relative">
            <div className="animate-float-slow">
              <img
                src="https://i.ibb.co/SD7FR8C3/cc-removebg-preview.png"
                alt="3D House Model"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 30px 60px rgba(71,55,39,0.15))" }}
              />

              {/* Brand seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#473727] rounded-full flex items-center justify-center shadow-2xl ring-4 ring-[#E8DCC8]/30">
                  <Check className="w-10 h-10 sm:w-12 sm:h-12 text-[#E8DCC8] stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
