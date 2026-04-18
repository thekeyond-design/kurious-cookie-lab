import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { FadeIn } from "@/components/ui/fade-in"
import { CookieGallery } from "@/components/sections/CookieGallery"
import type { CookieGalleryItem } from "@/components/sections/CookieGallery"
import { HeroSection } from "@/components/sections/HeroSection"
import { CountUp } from "@/components/ui/count-up"
import { existsSync } from "fs"
import path from "path"

const HERO_CANDIDATES = [
  "public/images/hero/hero.jpg",
  "public/images/cookies/classicassortment1.jpg",
]

function getHeroImage(): string | null {
  for (const p of HERO_CANDIDATES) {
    try {
      if (existsSync(path.join(process.cwd(), p))) {
        return "/" + p.replace("public/", "")
      }
    } catch { /* skip */ }
  }
  return null
}

// ─── Cookie gallery data ───────────────────────────────────────────────────────
const GALLERY_ITEMS: CookieGalleryItem[] = [
  {
    id: "Cc",
    title: "Chocolate Chip Toffee",
    description: "The classic, elevated. Buttery toffee bits folded into a rich chocolate chip base. Our most-ordered element.",
    href: "/order?start=chocolate-chip-toffee",
    image: "/images/cookies/CCT3.jpeg",
    color: "#FF3DA0",
  },
]

export default function Home() {
  const heroImage = getHeroImage()
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <HeroSection heroImage={heroImage} />
        <CookieGallery items={GALLERY_ITEMS} />
        <OurStorySection />
      </main>
      <Footer />
    </>
  )
}

/* ─── Our Story ───────────────────────────────────────────────────────────── */
function OurStorySection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden" style={{ background: "#FAF6F0" }}>
      {/* Subtle graph-paper grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Faint teal corner glow — cooler than the pink Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100vw)] h-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, #4DAEEA 0%, transparent 70%)" }}
      />

      <FadeIn className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        {/* Decorative science tiles */}
        <div className="flex justify-center gap-3 mb-2">
          {[
            { symbol: "H₂O", color: "#4DAEEA", label: "Water" },
            { symbol: "C₆",  color: "#FF3DA0", label: "Carbon" },
            { symbol: "NaHCO₃", color: "#3EC9C9", label: "Baking Soda" },
          ].map((el) => (
            <div
              key={el.symbol}
              className="px-3 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: `${el.color}40`,
                background: `${el.color}08`,
                color: `${el.color}`,
                fontFamily: "var(--font-oswald)",
                letterSpacing: "0.05em",
              }}
            >
              {el.symbol}
            </div>
          ))}
        </div>

        <span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3EC9C9]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Born in the Lab
        </span>

        <h2 className="leading-[1.1]">
          <span
            className="block text-4xl sm:text-5xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every batch is
          </span>
          <span
            className="block text-5xl sm:text-6xl text-[#FF3DA0] mt-1"
            style={{
              fontFamily: "var(--font-script)",
              fontWeight: 400,
              textShadow: "0 3px 16px rgba(180, 0, 80, 0.28)",
            }}
          >
            an experiment.
          </span>
        </h2>

        <p className="text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
          Kurious Cookie Lab was born from a curiosity that refused to stay in the kitchen.
          We treat every recipe like a formula — tested, refined, and perfected — so every
          bite delivers a{" "}
          <span
            className="text-[#FF3DA0] font-semibold not-italic"
            style={{ fontFamily: "var(--font-script)", fontSize: "1.15em" }}
          >
            consistent, joyful reaction.
          </span>
        </p>

        {/* Science stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { num: 6,    suffix: "+", label: "Core Elements",   color: "#4DAEEA" },
            { num: 100,  suffix: "%", label: "Batch to Order",  color: "#FF3DA0" },
            { num: null, suffix: "",  label: "Guilford County", color: "#3EC9C9", text: "NC" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border-2 py-3 px-2 text-center"
              style={{ borderColor: `${stat.color}25`, background: `${stat.color}06` }}
            >
              <div
                className="text-2xl font-extrabold leading-none"
                style={{ fontFamily: "var(--font-display)", color: stat.color }}
              >
                {stat.num !== null ? (
                  <CountUp to={stat.num} suffix={stat.suffix} />
                ) : (
                  stat.text
                )}
              </div>
              <div
                className="text-[9px] font-semibold uppercase tracking-wider mt-1 text-black/40"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#FF3DA0] text-[#FF3DA0]
                       font-bold text-sm px-8 py-3 hover:bg-[#FF3DA0] hover:text-white transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Read the Origin Story →
          </Link>

          <div className="flex items-center gap-6 text-xs text-black/35 font-medium uppercase tracking-widest"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            <span>Guilford County, NC</span>
            <span className="text-[#FF3DA0]/30">·</span>
            <span>Batch to Order</span>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

/* ─── Build Your Formula ──────────────────────────────────────────────────── */
function BuildYourFormulaSection() {
  return (
    <section className="py-28 px-4" style={{ background: "#1a1a4e" }}>
      <FadeIn className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            The Order Builder
          </span>

          <h2 className="leading-[1.1]">
            <span
              className="block text-4xl sm:text-5xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build Your
            </span>
            <span
              className="block text-5xl sm:text-6xl text-[#FF66C4] mt-1"
              style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
            >
              Formula.
            </span>
          </h2>

          <p className="text-lg text-white/45 max-w-md mx-auto leading-relaxed">
            Choose your batch size, select your elements from the periodic table,
            and we bake it fresh to order.
          </p>
        </div>

        {/* Steps — Oswald labels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { num: "01", label: "Pick a Batch", body: "6, 12, or larger. Each size unlocks more flavor combinations." },
            { num: "02", label: "Select Elements", body: "Click your cookies on the periodic table. Mix and match." },
            { num: "03", label: "We Synthesize", body: "Pickup, local delivery, or ship it. Baked fresh, every time." },
          ].map((step) => (
            <div key={step.num} className="rounded-2xl border border-white/10 p-6 space-y-3 bg-white/5">
              <span
                className="text-3xl font-bold text-[#FF3DA0]/60"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {step.num}
              </span>
              <h3
                className="text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.label}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <Link
          href="/menu"
          className="inline-flex rounded-2xl bg-[#FF3DA0] text-white font-bold text-lg px-12 py-5
                     hover:bg-[#FF66C4] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Start Your Experiment →
        </Link>
      </FadeIn>
    </section>
  )
}
