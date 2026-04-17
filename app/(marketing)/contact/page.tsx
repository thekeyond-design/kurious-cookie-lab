import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Glow } from "@/components/ui/glow"
import { CopyButton } from "@/components/ui/copy-button"

export const metadata = {
  title: "Contact | Kurious Cookie Lab",
  description: "Get in touch with Kurious Cookie Lab — questions, custom orders, events, and more.",
}

const CONTACT_ITEMS = [
  {
    symbol: "Ig",
    atomicNumber: 1,
    label: "Instagram",
    value: "@kuriouscookielab",
    href: "https://www.instagram.com/kuriouscookielab/",
    external: true,
    color: "#FF3DA0",
    description: "Follow along for drops, behind-the-scenes, and new flavors.",
  },
  {
    symbol: "Em",
    atomicNumber: 2,
    label: "Email",
    value: "kuriouscookielab@gmail.com",
    href: "mailto:kuriouscookielab@gmail.com",
    external: false,
    color: "#4DAEEA",
    description: "Best for custom orders, catering inquiries, and collabs.",
  },
  {
    symbol: "Ph",
    atomicNumber: 3,
    label: "Phone",
    value: "(803) 431-0081",
    href: "tel:+18034310081",
    external: false,
    color: "#3EC9C9",
    description: "Call or text — we'll get back to you as soon as we can.",
  },
]

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen" style={{ background: "#FAF6F0" }}>
        <HeroSection />
        <ContactCardsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28 px-4" style={{ background: "#FAF6F0" }}>
      {/* Warm cookie photo — right side decorative */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block overflow-hidden">
        <Image
          src="/images/cookies/sc2.jpg"
          alt=""
          fill
          className="object-cover object-left opacity-20"
          sizes="33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/60 to-transparent" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Glow variant="center" className="opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0] border border-[#FF3DA0]/30 rounded-full px-5 py-1.5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Get In Touch
        </span>

        <h1 className="leading-[1.05]">
          <span
            className="block text-5xl sm:text-6xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let&apos;s talk
          </span>
          <span
            className="block text-5xl sm:text-6xl text-[#FF3DA0] mt-1"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            cookies.
          </span>
        </h1>

        <p className="text-lg text-black/55 leading-relaxed max-w-lg mx-auto">
          Questions about an order, custom batch requests, event catering — whatever it is,
          we&apos;d love to hear from you.
        </p>
      </div>
    </section>
  )
}

/* ─── Contact Cards ─────────────────────────────────────────────────────────── */
function ContactCardsSection() {
  return (
    <section className="py-16 px-4" style={{ background: "#FAF6F0" }}>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {CONTACT_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group block rounded-3xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{
              borderColor: `${item.color}20`,
              background: "white",
            }}
          >
            {/* Element tile */}
            <div
              className="relative w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center mb-6 transition-all group-hover:scale-105"
              style={{
                borderColor: item.color,
                background: `${item.color}10`,
                boxShadow: `0 4px 20px ${item.color}30`,
              }}
            >
              <span
                className="absolute top-1 left-1.5 text-[9px] font-mono leading-none"
                style={{ color: `${item.color}80` }}
              >
                {item.atomicNumber}
              </span>
              <span
                className="text-xl font-extrabold leading-none"
                style={{ color: item.color, fontFamily: "var(--font-display)" }}
              >
                {item.symbol}
              </span>
              <span
                className="text-[8px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: `${item.color}80`, fontFamily: "var(--font-oswald)" }}
              >
                {item.label}
              </span>
            </div>

            <p className="text-xs text-black/40 mb-1" style={{ fontFamily: "var(--font-oswald)" }}>
              {item.label}
            </p>
            <p
              className="text-sm font-extrabold text-black mb-3 group-hover:text-[#FF3DA0] transition-colors"
              style={{ fontFamily: "var(--font-display)", wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {item.value}
            </p>
            <p className="text-sm text-black/45 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span
                className="text-xs font-semibold uppercase tracking-[0.15em] transition-colors"
                style={{ color: item.color, fontFamily: "var(--font-oswald)" }}
              >
                {item.external ? "Visit →" : "Contact →"}
              </span>
              {!item.external && (
                <CopyButton value={item.value} label={item.label} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section
      className="py-24 px-4 mt-8"
      style={{
        background: "linear-gradient(135deg, #FF3DA0 0%, #FF66C4 50%, #FF9F43 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/70 border border-white/30 rounded-full px-5 py-1.5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Ready to Order?
        </span>

        <h2 className="leading-tight">
          <span
            className="block text-4xl sm:text-5xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Skip the small talk —
          </span>
          <span
            className="block text-4xl sm:text-5xl text-white/80 mt-1"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            build your formula.
          </span>
        </h2>

        <p className="text-white/75 text-base leading-relaxed max-w-sm mx-auto">
          Pick your flavors, choose your batch size, and checkout in minutes.
        </p>

        <Link
          href="/order"
          className="inline-block rounded-2xl bg-white font-extrabold text-base px-10 py-4
                     hover:bg-white/90 transition-all shadow-lg hover:-translate-y-0.5"
          style={{ fontFamily: "var(--font-display)", color: "#FF3DA0" }}
        >
          Start Your Order →
        </Link>
      </div>
    </section>
  )
}
