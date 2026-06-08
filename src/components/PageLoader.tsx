import { useEffect, useState } from "react";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "hidden">("loading");

  useEffect(() => {
    if (sessionStorage.getItem("sv_loaded") === "1") {
      setPhase("hidden");
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.max(1, Math.round((100 - current) * 0.07));
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setPhase("done"), 400);
        setTimeout(() => {
          setPhase("hidden");
          sessionStorage.setItem("sv_loaded", "1");
        }, 1500);
      } else {
        setProgress(current);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#FCFAF5",
        transform: phase === "done" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1.1s cubic-bezier(0.87, 0, 0.13, 1)",
      }}
    >
      {/* Subtle texture line */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#473727]/15" />

      {/* Logo */}
      <div
        className="mb-10"
        style={{
          opacity: progress > 10 ? 1 : 0,
          transform: progress > 10 ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        <img
          src="https://i.ibb.co/Z6CBvxYn/SVLOGO.png"
          alt="SV Developers"
          className="h-20 w-auto object-contain"
          style={{ filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(-5deg) brightness(1.3)" }}
        />
      </div>

      {/* Brand line */}
      <p
        className="text-[#473727]/50 tracking-[0.4em] text-[0.6rem] uppercase mb-12 font-body"
        style={{
          opacity: progress > 20 ? 1 : 0,
          transition: "opacity 1.2s ease 0.3s",
        }}
      >
        Est. 2013 &nbsp;·&nbsp; Bengaluru
      </p>

      {/* Progress bar */}
      <div className="relative w-48 sm:w-64 h-px bg-[#473727]/15 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[#473727]"
          style={{
            width: `${progress}%`,
            transition: "width 0.2s ease-out",
          }}
        />
      </div>

      {/* Counter */}
      <div
        className="mt-5 font-heading text-[#473727]/40 text-2xl tabular-nums tracking-wider"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {String(progress).padStart(2, "0")}
        <span className="text-sm align-top ml-0.5 opacity-60">%</span>
      </div>

      {/* Bottom accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#473727]/15" />
    </div>
  );
}
