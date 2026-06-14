import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact",  href: "/#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: "background 0.6s ease, padding 0.5s ease, border-color 0.6s ease",
          padding: isScrolled ? "12px 0" : "20px 0",
          background: isScrolled ? "rgba(252,250,245,0.92)" : "transparent",
          backdropFilter: isScrolled ? "blur(14px)" : "none",
          borderBottom: "1px solid",
          borderColor: isScrolled ? "rgba(71,55,39,0.12)" : "transparent",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(1rem, 4vw, 40px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link
            to="/"
            style={{
              zIndex: 50,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(-8px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <img
              src="/SVLOGO.png"
              alt="SV Developers"
              style={{
                height: isScrolled ? 48 : 54,
                width: "auto",
                objectFit: "contain",
                filter: isScrolled
                  ? "none"
                  : "brightness(0) invert(1) opacity(0.88)",
                transition: "height 0.5s ease, filter 0.6s ease",
              }}
            />
          </Link>

          {/* Desktop nav — ultra minimal */}
          <nav style={{ display: "none" }} className="lg:flex items-center gap-10 xl:gap-12">
            {navItems.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="group"
                style={{
                  position: "relative",
                  fontSize: "0.65rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  fontWeight: 500,
                  color: "rgba(71,55,39,0.55)",
                  transition: "color 0.4s ease, opacity 0.7s ease, transform 0.7s ease",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "none" : "translateY(-8px)",
                  transitionDelay: `${100 + i * 60}ms`,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(71,55,39,1)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(71,55,39,0.55)")
                }
              >
                {item.label}
                {/* underline reveal */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: 1,
                    background: "rgba(71,55,39,0.30)",
                    transformOrigin: "right",
                    transform: "scaleX(0)",
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  className="group-hover:[transform:scaleX(1)] group-hover:[transform-origin:left]"
                />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="/#contact"
            className="btn-fill hidden lg:inline-flex items-center"
            style={{
              padding: "10px 24px",
              background: "#473727",
              color: "#E8DCC8",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body, Inter, sans-serif)",
              fontWeight: 500,
              textDecoration: "none",
              opacity: mounted && pastHero ? 1 : 0,
              transform: mounted && pastHero ? "none" : "translateY(-8px)",
              pointerEvents: pastHero ? "auto" : "none",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            Enquire
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
            style={{
              position: "relative",
              zIndex: 50,
              width: 40,
              height: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "none",
            }}
          >
            <span
              style={{
                display: "block",
                height: 1,
                width: 24,
                background: "rgba(71,55,39,0.80)",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: isOpen ? "rotate(45deg) translateY(6px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: 1,
                width: 16,
                background: "rgba(71,55,39,0.80)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: isOpen ? 0 : 1,
                transform: isOpen ? "scaleX(0)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: 1,
                width: 24,
                background: "rgba(71,55,39,0.80)",
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(-45deg) translateY(-6px)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "#FCFAF5",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), visibility 0.6s",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {/* Large watermark */}
        <span
          style={{
            position: "absolute",
            bottom: -20,
            right: -8,
            fontFamily: "Playfair Display, serif",
            fontSize: "50vw",
            lineHeight: 1,
            color: "rgba(71,55,39,0.06)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          SV
        </span>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 6,
            padding: 24,
          }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                color: "rgba(71,55,39,0.80)",
                textDecoration: "none",
                transition: `opacity 0.5s ease ${isOpen ? i * 70 + 200 : 0}ms, transform 0.5s ease ${isOpen ? i * 70 + 200 : 0}ms, color 0.3s ease`,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "none" : "translateY(20px)",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(71,55,39,1)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(71,55,39,0.80)")
              }
            >
              {item.label}
            </a>
          ))}

          <a
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="btn-fill"
            style={{
              marginTop: 24,
              padding: "14px 36px",
              background: "#473727",
              color: "#E8DCC8",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              transition: `opacity 0.5s ease ${isOpen ? navItems.length * 70 + 220 : 0}ms`,
              opacity: isOpen ? 1 : 0,
            }}
          >
            Get In Touch
          </a>
        </nav>
      </div>
    </>
  );
}
