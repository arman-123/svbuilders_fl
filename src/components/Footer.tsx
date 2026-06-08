import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/#contact" },
];

const services = [
  "Construction",
  "Apartments",
  "Townships",
  "Layouts",
  "Villas",
  "Real Estate Marketing",
];

export default function Footer() {
  const year      = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  /* Touch delegation — adds .group-touch on touchstart, removes after 400ms */
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    let activeEl: HTMLElement | null = null;

    const onStart = (e: TouchEvent) => {
      const group = (e.target as HTMLElement).closest<HTMLElement>(".group");
      if (!group) return;
      if (activeEl && activeEl !== group) activeEl.classList.remove("group-touch");
      group.classList.add("group-touch");
      activeEl = group;
    };
    const onEnd = () => {
      if (activeEl) {
        const el = activeEl;
        setTimeout(() => el.classList.remove("group-touch"), 400);
        activeEl = null;
      }
    };

    footer.addEventListener("touchstart", onStart, { passive: true });
    footer.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      footer.removeEventListener("touchstart", onStart);
      footer.removeEventListener("touchend",   onEnd);
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#1C0D07] text-[#E8DCC8] overflow-hidden font-body">
      {/* Watermark */}
      <span className="pointer-events-none absolute -top-6 right-0 font-heading text-[26vw] leading-none text-[#E8DCC8]/[0.025] select-none">
        SV
      </span>

      {/* Top accent line */}
      <div className="h-px bg-[#E8DCC8]/08" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="https://i.ibb.co/Z6CBvxYn/SVLOGO.png"
              alt="SV Developers"
              className="h-16 w-auto object-contain mb-5"
              style={{ filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(-5deg) brightness(1.3)" }}
            />
            <p className="text-[#E8DCC8]/35 text-sm leading-relaxed mb-6">
              Building dreams, creating landmarks, and delivering excellence in every square foot since 2013.
            </p>
            <p className="section-label text-[#E8DCC8]/20">Est. 2013 · Bengaluru</p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="section-label text-[#E8DCC8]/35 mb-6">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-[#E8DCC8]/45 hover:text-[#E8DCC8] transition-colors duration-300 text-sm"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:-translate-x-0 -translate-x-3 group-hover:translate-x-0 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="section-label text-[#E8DCC8]/35 mb-6">Services</p>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="/#services"
                    className="group flex items-center gap-2 text-[#E8DCC8]/45 hover:text-[#E8DCC8] transition-colors duration-300 text-sm"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="-translate-x-3 group-hover:translate-x-0 transition-transform duration-300">
                      {s}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label text-[#E8DCC8]/35 mb-6">Get In Touch</p>
            <ul className="space-y-5">
              <li>
                <a href="tel:+919945586527" className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <div>
                    <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors">
                      +91 9945586527
                    </p>
                    <p className="text-[#E8DCC8]/25 text-xs mt-0.5">Primary</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919538595685" className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <div>
                    <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors">
                      +91 9538595685
                    </p>
                    <p className="text-[#E8DCC8]/25 text-xs mt-0.5">Alternate</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:svdevelopers.construct@gmail.com" className="flex items-start gap-3 group">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors break-all">
                    svdevelopers.construct@gmail.com
                  </p>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=116,10th+Cross+Rd,Binnamangala,Indiranagar,Bengaluru,Karnataka+560038"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <div>
                    <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors">
                      116, 10th Cross Rd
                    </p>
                    <p className="text-[#E8DCC8]/25 text-xs mt-0.5">Indiranagar, Bengaluru – 560038</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E8DCC8]/07 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#E8DCC8]/25 text-xs text-center md:text-left tracking-wide">
            © {year}{" "}
            <span className="text-[#E8DCC8]/45">SV Developers &amp; Constructions</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((t) => (
              <a key={t} href="#" className="text-[#E8DCC8]/25 hover:text-[#E8DCC8]/55 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-px bg-[#473727]" />
    </footer>
  );
}
