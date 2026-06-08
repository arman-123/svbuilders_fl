import { useEffect, useRef, useState } from "react";
import { X, Loader2, Check, Download } from "lucide-react";

/**
 * Reusable brochure lead-capture modal.
 *
 * Collects Name / Email / Mobile, validates inline, POSTs the lead to the
 * backend (`POST /api/brochure-download`), then shows a success state.
 * Falls back gracefully (still shows success + direct download) if the API
 * is unreachable, so the front-end works even without the server running.
 */

const API_BASE = (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE ?? "";
const BROCHURE_URL = "/aurora-brochure.pdf"; // optional direct download asset

interface Props {
  open: boolean;
  onClose: () => void;
  project?: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?\d{1,3}[ -]?)?\d{10}$/;

export default function BrochureModal({ open, onClose, project = "Aurora" }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  /* Reset + focus when opened, lock body scroll */
  useEffect(() => {
    if (!open) return;
    setForm({ name: "", email: "", phone: "" });
    setErrors({});
    setStatus("idle");
    setServerError("");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function validate(): boolean {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    else if (form.name.trim().length < 2) next.name = "Name looks too short.";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    const digits = form.phone.replace(/[^\d+]/g, "");
    if (!form.phone.trim()) next.phone = "Please enter your mobile number.";
    else if (!PHONE_RE.test(digits)) next.phone = "Enter a valid 10-digit mobile number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch(`${API_BASE}/api/brochure-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/[^\d+]/g, ""),
          project,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Submission failed. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      // Network/server unavailable — still let the visitor download directly.
      if (err instanceof TypeError) {
        setStatus("success");
      } else {
        setServerError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    }
  }

  if (!open) return null;

  const ease = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Download Aurora brochure"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(15,13,10,0.72)", backdropFilter: "blur(4px)", animation: "svFade 0.3s ease" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-[#E8DCC8] shadow-2xl"
        style={{ animation: `svRise 0.5s ${ease}` }}
      >
        <div style={{ height: 3, background: "linear-gradient(to right, #BE9234, rgba(190,146,52,0.25))" }} />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#473727] hover:bg-[#473727] hover:text-[#E8DCC8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-7 sm:px-9 py-9">
          {status === "success" ? (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: "#473727", animation: `svPop 0.5s ${ease}` }}
              >
                <Check className="w-7 h-7 text-[#E8DCC8]" strokeWidth={2.5} />
              </div>
              <h3
                className="mb-3"
                style={{ fontFamily: "var(--font-heading, serif)", fontSize: "1.9rem", fontWeight: 700, color: "#0f0d0a", lineHeight: 1.1 }}
              >
                Thank you.
              </h3>
              <p className="font-libre mb-7" style={{ color: "#2a2018", fontSize: "0.98rem", lineHeight: 1.7 }}>
                The Aurora brochure has been sent to your email. A member of our team will reach out shortly.
              </p>
              <a
                href={BROCHURE_URL}
                download
                className="inline-flex items-center gap-2 px-6 py-3 font-body text-[0.7rem] tracking-[0.2em] uppercase"
                style={{ background: "#473727", color: "#E8DCC8", fontWeight: 600 }}
              >
                <Download className="w-3.5 h-3.5" />
                Download Now
              </a>
            </div>
          ) : (
            <>
              <p className="section-label font-body mb-3" style={{ color: "rgba(71,55,39,0.88)" }}>
                The Aurora
              </p>
              <h3
                className="mb-2"
                style={{ fontFamily: "var(--font-heading, serif)", fontSize: "2rem", fontWeight: 700, color: "#0f0d0a", lineHeight: 1.05 }}
              >
                Request the Brochure
              </h3>
              <p className="font-libre mb-6" style={{ color: "#2a2018", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Share a few details and we will send the Pre-Launch deck to your inbox.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Field
                  ref={firstFieldRef}
                  label="Full Name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => update("name", v)}
                  type="text"
                  autoComplete="name"
                />
                <Field
                  label="Email Address"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => update("email", v)}
                  type="email"
                  autoComplete="email"
                />
                <Field
                  label="Mobile Number"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => update("phone", v)}
                  type="tel"
                  autoComplete="tel"
                />

                {status === "error" && serverError && (
                  <p className="text-[0.78rem]" style={{ color: "#a33" }}>
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 font-body text-[0.72rem] tracking-[0.22em] uppercase mt-2 disabled:opacity-70"
                  style={{ background: "#473727", color: "#E8DCC8", fontWeight: 600, transition: "opacity 0.3s ease" }}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Download Brochure"
                  )}
                </button>
                <p className="text-center text-[0.62rem] tracking-wide" style={{ color: "rgba(71,55,39,0.6)" }}>
                  Your details are kept confidential.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes svFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes svRise { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes svPop { 0% { transform: scale(0.6); opacity: 0 } 60% { transform: scale(1.08) } 100% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

/* ── Labelled input with inline error ── */
import { forwardRef } from "react";

interface FieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, value, error, onChange, type, autoComplete }, ref) => (
    <div>
      <label
        className="block font-body mb-1.5"
        style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "#473727" }}
      >
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="w-full bg-transparent px-0 py-2 font-libre text-[0.95rem] text-[#1a140e] outline-none"
        style={{
          borderBottom: `1px solid ${error ? "#a33" : "rgba(71,55,39,0.35)"}`,
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderBottomColor = "#BE9234";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderBottomColor = "rgba(71,55,39,0.35)";
        }}
      />
      {error && (
        <p className="mt-1 text-[0.72rem] font-body" style={{ color: "#a33" }}>
          {error}
        </p>
      )}
    </div>
  )
);
Field.displayName = "Field";
