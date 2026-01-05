import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "/Projects" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#E8DCC8]/95 backdrop-blur-md py-2 sm:py-2 shadow-lg"
            : "bg-transparent py-3 sm:py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group z-50">
              <img 
                src="https://i.ibb.co/Z6CBvxYn/SVLOGO.png" 
                alt="SV Developers Logo" 
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`nav-link ${
                    isScrolled ? "text-black" : "text-cream"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Contact Button - Desktop */}
            <a
  href="#contact"
  className="hidden lg:inline-flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 
             bg-[#473727] text-white font-medium text-sm
             hover:bg-[#6b4f33] transition-all duration-300 
             hover:shadow-lg hover:shadow-gold/25"
>
  Contact Us
</a>


            {/* Hamburger Menu - Mobile & Tablet */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 ${
                isOpen ? "hamburger-open" : ""
              }`}
              aria-label="Toggle menu"
            >
              <span className={`hamburger-line ${isOpen ? "bg-foreground" : "bg-[#473727]"}`}></span>
              <span className={`hamburger-line w-3 ${isOpen ? "bg-foreground" : "bg-[#473727]"}`}></span>
              <span className={`hamburger-line ${isOpen ? "bg-foreground" : "bg-[#473727]"}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-background transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-6 sm:gap-8 px-4">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-foreground text-xl sm:text-2xl font-heading tracking-wide hover:text-gold transition-all duration-300 transform ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: isOpen ? `${index * 100 + 200}ms` : "0ms",
              }}
            >
              {item.label}
            </a>
          ))}
      <a
  href="#contact"
  onClick={() => setIsOpen(false)}
  className={`mt-4 px-6 sm:px-8 py-2.5 sm:py-3 
              bg-[#473727] text-white font-medium text-sm sm:text-base 
              
              hover:bg-[#6b4f33] 
              transition-all duration-300 transform ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
  style={{
    transitionDelay: isOpen
      ? `${navItems.length * 100 + 200}ms`
      : "0ms",
  }}
>
  Contact Us
</a>

        </nav>
      </div>
    </>
  );
};

export default Header;
