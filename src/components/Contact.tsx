import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, User, MessageSquare, Instagram } from "lucide-react";

const contactInfo = [
  {
    icon: Instagram,
    title: "Follow Us",
    info: "@svdevelopers",
    subInfo: "DM us anytime",
    link: "#",
  },
  {
    icon: Phone,
    title: "Call Us",
    info: "+91 9538595685",
    subInfo: "Mon–Sat 9AM–6PM",
    link: "tel:+919538595685",
  },
  {
    icon: Mail,
    title: "Email Us",
    info: "marketing@svdevelopers.in",
    subInfo: "Reply within 24 hours",
    link: "marketing@svdevelopers.in",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    info: "116, 10th Cross Rd, Binnamangala",
    subInfo: "Indiranagar, Bengaluru – 560038",
    link: "https://maps.google.com/?q=116,10th+Cross+Rd,Binnamangala,Indiranagar,Bengaluru,Karnataka+560038",
  },
];

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const msg =
      `*New Contact Form Submission*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Subject:* ${formData.subject}%0A%0A` +
      `*Message:*%0A${formData.message}`;

    window.open(`https://wa.me/919538595685?text=${msg}`, "_blank");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  // Shared input class helpers
  const inputBase =
    "peer w-full bg-transparent border-0 border-b border-[#0f0d0a]/18 focus:border-[#0f0d0a] outline-none py-3 pl-8 text-[#0f0d0a] placeholder-transparent transition-colors duration-300 text-sm font-body";
  const labelBase =
    "absolute left-8 top-3 text-[#0f0d0a]/40 text-sm transition-all duration-300 pointer-events-none font-body " +
    "peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#0f0d0a]/70 " +
    "peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs";
  const iconBase = "absolute left-0 top-3 w-5 h-5 text-[#0f0d0a]/30 pointer-events-none";

  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">

        {/* LEFT — dark info panel */}
        <div className="relative bg-[#2A1507] text-[#E8DCC8] px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-32 overflow-hidden">
          {/* Watermark */}
          <span className="pointer-events-none absolute -bottom-8 -left-2 font-heading text-[28vw] lg:text-[18rem] leading-none text-[#E8DCC8]/[0.035] select-none">
            Hi
          </span>

          <div
            className="relative transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <p className="section-label text-[#E8DCC8]/30 mb-5 font-body">Get In Touch</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] mb-5">
              Let's build
              <br />
              <span className="italic font-normal text-[#D9B45E]">
                something great
              </span>
            </h2>
            <div className="w-10 h-px bg-[#E8DCC8]/30 mb-7" />
            <p className="text-[#E8DCC8]/40 text-base font-libre max-w-sm mb-12 leading-relaxed">
              Have a project in mind? Let us know — we'll bring your vision to life.
            </p>

            {/* Contact list */}
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <a
                  key={item.title}
                  href={item.link}
                  target={item.icon === MapPin || item.icon === Mail ? "_blank" : "_self"}
                  rel={item.icon === MapPin || item.icon === Mail ? "noopener noreferrer" : ""}
                  className="flex items-start gap-4 group"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(-16px)",
                    transition: `opacity 0.8s ease ${300 + idx * 110}ms, transform 0.8s ease ${300 + idx * 110}ms`,
                  }}
                  onTouchStart={e => e.currentTarget.classList.add("group-touch")}
                  onTouchEnd={e => { const el = e.currentTarget; setTimeout(() => el.classList.remove("group-touch"), 400); }}
                >
                  <div className="w-10 h-10 flex-shrink-0 border border-[#E8DCC8]/15 flex items-center justify-center group-hover:bg-[#473727] group-hover:border-[#473727] transition-all duration-500">
                    <item.icon className="w-4 h-4 text-[#E8DCC8]/40 group-hover:text-[#E8DCC8] transition-colors duration-500" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#E8DCC8]/30 mb-0.5 font-body">
                      {item.title}
                    </p>
                    <p className="text-[#E8DCC8]/75 text-sm font-body group-hover:text-[#E8DCC8] transition-colors break-all">
                      {item.info}
                    </p>
                    <p className="text-[#E8DCC8]/30 text-xs mt-0.5 font-body">{item.subInfo}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="relative bg-[#FCFAF5] px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-32 flex items-center">
          <div
            className="w-full transition-all duration-1000 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <h3 className="font-heading text-2xl sm:text-3xl text-[#0f0d0a] mb-10">
              Send us a Message
            </h3>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Name */}
                <div className="relative">
                  <User className={iconBase} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={inputBase}
                  />
                  <label htmlFor="name" className={labelBase}>Full Name *</label>
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className={iconBase} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputBase}
                  />
                  <label htmlFor="email" className={labelBase}>Email Address *</label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Phone */}
                <div className="relative">
                  <Phone className={iconBase} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputBase}
                  />
                  <label htmlFor="phone" className={labelBase}>Phone Number *</label>
                </div>

                {/* Subject */}
                <div className="relative">
                  <MessageSquare className={iconBase} />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={inputBase}
                  />
                  <label htmlFor="subject" className={labelBase}>Subject *</label>
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  className="peer w-full bg-transparent border-0 border-b border-[#0f0d0a]/18 focus:border-[#0f0d0a] outline-none py-3 text-[#0f0d0a] placeholder-transparent transition-colors duration-300 resize-none text-sm font-body"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-3 text-[#0f0d0a]/40 text-sm transition-all duration-300 pointer-events-none font-body peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#0f0d0a]/70 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Your Message *
                </label>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="btn-fill group w-full sm:w-auto bg-[#473727] text-[#E8DCC8] font-body font-medium tracking-[0.18em] uppercase text-[0.7rem] py-4 px-10 inline-flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
