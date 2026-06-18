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
              src="/SVLOGO.png"
              alt="SV Developers"
              className="h-16 w-auto object-contain mb-5"
              style={{ filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(-5deg) brightness(1.3)" }}
            />
            <p className="text-[#E8DCC8]/35 text-sm leading-relaxed mb-6">
              Building dreams, creating landmarks, and delivering excellence in every square foot since 2013.
            </p>
            <p className="section-label text-[#E8DCC8]/20 mb-6">Est. 2013 · Bengaluru</p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { href: "https://www.instagram.com/svdevelopersofficial/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { href: "https://www.facebook.com/profile.php?id=61591032538637", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: "https://www.linkedin.com/company/sv-developers-official/", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { href: "https://x.com/SVDevelopersofc", label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { href: "https://www.reddit.com/user/SVDevelopersOfficial/", label: "Reddit", path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" },
              ].map(({ href, label, path }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-[#E8DCC8]/12 text-[#E8DCC8]/30 hover:text-[#E8DCC8]/80 hover:border-[#E8DCC8]/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
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
                <a href="tel:+919538595685" className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <div>
                    <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors">
                      +91 9538595685
                    </p>
                    
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:marketing@svdevelopers.in" className="flex items-start gap-3 group">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors break-all">
                    marketing@svdevelopers.in
                  </p>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/wU2sxfTh5KKTz1B7A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8DCC8]/25 group-hover:text-[#E8DCC8]/60 transition-colors" />
                  <div>
                    <p className="text-[#E8DCC8]/65 text-sm group-hover:text-[#E8DCC8] transition-colors">
                      SV developers, 1st Floor, No. 17, 1st Main Rd, HAL 2nd Stage,
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
            <span className="text-[#E8DCC8]/45">SV Developers </span>. All rights reserved.
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
