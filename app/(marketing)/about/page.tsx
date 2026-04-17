import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Glow } from "@/components/ui/glow"
import { FadeIn } from "@/components/ui/fade-in"

export const metadata = {
  title: "Our Story | Kurious Cookie Lab",
  description: "Where science meets sweetness. Learn about the curiosity, mission, and chemistry behind Kurious Cookie Lab.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col" style={{ background: "#FAF6F0" }}>
        <OurStorySection />
        <PhotoStrip />
        <MeetTheScientistSection />
        <MissionSection />
        <JourneySection />
        <ScienceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ─── Our Story ───────────────────────────────────────────────────────────── */
function OurStorySection() {
  return (
    <section className="relative overflow-hidden py-28 px-4" style={{ background: "#FAF6F0" }}>
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Warmth glow */}
      <Glow variant="center" className="opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0] border border-[#FF3DA0]/30 rounded-full px-5 py-1.5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Our Story
        </span>

        <h1 className="leading-[1.05]">
          <span
            className="block text-5xl sm:text-6xl md:text-7xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where Science Meets
          </span>
          <span
            className="block text-5xl sm:text-6xl md:text-7xl text-[#FF3DA0] mt-2"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            Sweetness.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-black/55 max-w-2xl mx-auto leading-relaxed">
          Kurious Cookie Lab was born from a simple idea: learning should be as enjoyable
          as eating a warm cookie. We combine artisan baking with STEM education to create
          experiences that{" "}
          <span
            className="text-[#FF3DA0]"
            style={{ fontFamily: "var(--font-script)", fontSize: "1.1em" }}
          >
            spark curiosity
          </span>{" "}
          in every bite.
        </p>

        {/* Decorative element tiles */}
        <div className="flex justify-center gap-3 pt-4">
          {[
            { symbol: "Cc", color: "#4DAEEA", num: 1 },
            { symbol: "Su", color: "#FF3DA0", num: 4 },
            { symbol: "Sn", color: "#3EC9C9", num: 6 },
          ].map((el) => (
            <div
              key={el.symbol}
              className="w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center opacity-40"
              style={{ borderColor: el.color, background: `${el.color}10` }}
            >
              <span className="text-[8px] font-mono self-start ml-1.5 leading-none" style={{ color: el.color }}>
                {el.num}
              </span>
              <span
                className="text-lg font-extrabold leading-none"
                style={{ fontFamily: "var(--font-display)", color: el.color }}
              >
                {el.symbol}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Photo Strip ─────────────────────────────────────────────────────────── */
function PhotoStrip() {
  const photos = [
    { src: "/images/cookies/bp2.jpg",  alt: "Banana pudding cookies fresh from the oven", aspect: "aspect-[3/4]" },
    { src: "/images/cookies/classicassortment1.jpg", alt: "Classic cookie assortment", aspect: "aspect-square" },
    { src: "/images/cookies/pbo2.jpg", alt: "Peanut butter oreo cookies", aspect: "aspect-[3/4]" },
  ]

  return (
    <div className="px-4 py-6" style={{ background: "#FAF6F0" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-3 sm:gap-4">
        {photos.map((p, i) => (
          <FadeIn key={p.src} delay={i * 100} direction="up">
            <div className={`relative ${p.aspect} rounded-2xl overflow-hidden shadow-md`}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 320px"
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

/* ─── Meet The Scientist ──────────────────────────────────────────────────── */
function MeetTheScientistSection() {
  return (
    <section className="py-24 px-4" style={{ background: "#FAF6F0" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Photo */}
          <FadeIn direction="left">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/brand/malia-walker-founder-ZNiwi5vp.jpg"
                  alt="Malia Walker, Founder of Kurious Cookie Lab"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 480px"
                />
                {/* Bottom name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-6 pt-12 z-10">
                  <p
                    className="text-white font-extrabold text-xl leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Malia Walker
                  </p>
                  <p
                    className="text-white/60 text-xs mt-0.5 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Founder &amp; Chief Scientist
                  </p>
                </div>
              </div>

              {/* Element tile badge */}
              <div
                className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl border-2 border-[#FF3DA0] bg-white
                           flex flex-col items-center justify-center shadow-lg"
              >
                <span className="text-[8px] font-mono text-[#FF3DA0]/50 self-start ml-2 leading-none">Fs</span>
                <span
                  className="text-lg font-extrabold text-[#FF3DA0] leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Mw
                </span>
                <span
                  className="text-[7px] font-semibold uppercase tracking-wide mt-0.5 text-[#FF3DA0]/60"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Founder
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right" delay={100}>
            <div className="space-y-6">
              <div className="space-y-2">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0]"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Meet The Scientist
                </span>
                <h2 className="leading-tight">
                  <span
                    className="block text-3xl sm:text-4xl font-extrabold text-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Where Curiosity
                  </span>
                  <span
                    className="block text-4xl sm:text-5xl text-[#FF3DA0] mt-1"
                    style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
                  >
                    Meets the Kitchen.
                  </span>
                </h2>
              </div>

              <p className="text-base text-black/60 leading-relaxed">
                Malia Walker is the founder and head baker behind Kurious Cookie Lab — a STEM-inspired artisan cookie brand born right here in Guilford County, NC. With a deep love for both science and community, Malia set out to prove that the most powerful lessons happen when you&apos;re genuinely having fun.
              </p>

              <p className="text-base text-black/60 leading-relaxed">
                What started as a home kitchen experiment became a mission: make STEM approachable, delicious, and joyful for everyone. Every cookie is hand-crafted, every recipe is tested like a hypothesis, and every box shipped carries a little piece of that original curiosity.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { label: "STEM Education", color: "#4DAEEA" },
                  { label: "Artisan Baking", color: "#FF3DA0" },
                  { label: "Guilford County, NC", color: "#3EC9C9" },
                  { label: "Made to Order", color: "#FF9F43" },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                    style={{
                      borderColor: `${tag.color}40`,
                      color: tag.color,
                      background: `${tag.color}10`,
                      fontFamily: "var(--font-oswald)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─── Mission ─────────────────────────────────────────────────────────────── */
const BELIEFS = [
  {
    title: "Science-First Approach",
    body: "Every recipe is developed with precision and understanding of the chemistry behind perfect cookies.",
    color: "#4DAEEA",
    label: "Precision",
  },
  {
    title: "Made with Love",
    body: "Small-batch baking means every cookie gets the attention it deserves. No shortcuts, ever.",
    color: "#FF3DA0",
    label: "Care",
  },
  {
    title: "Spark Curiosity",
    body: "We believe learning happens best when it's delicious. Every cookie is an opportunity to discover.",
    color: "#FF9F43",
    label: "Discovery",
  },
  {
    title: "Community Focused",
    body: "From schools to families, we're building a community of curious minds who love to learn.",
    color: "#3EC9C9",
    label: "Together",
  },
]

function MissionSection() {
  return (
    <section className="py-24 px-4" style={{ background: "#1a1a4e" }}>
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Mission statement */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Our Mission
          </span>
          <h2 className="leading-[1.1]">
            <span
              className="block text-3xl sm:text-4xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              To inspire the next generation of curious minds by making STEM
            </span>
            <span
              className="block text-4xl sm:text-5xl text-[#FF66C4] mt-2"
              style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
            >
              accessible, delicious, and fun.
            </span>
          </h2>
          <p className="text-white/40 text-base">One cookie at a time.</p>
        </div>

        {/* What we believe */}
        <div className="space-y-6">
          <span
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/25 text-center"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            What We Believe
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BELIEFS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 100} direction="up">
              <div
                className="rounded-2xl border p-6 space-y-3 transition-all duration-200 hover:-translate-y-0.5 h-full"
                style={{
                  borderColor: `${b.color}25`,
                  background: `${b.color}08`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${b.color}20`, border: `2px solid ${b.color}40` }}
                  >
                    <span
                      className="text-[9px] font-black"
                      style={{ fontFamily: "var(--font-oswald)", color: b.color, letterSpacing: "0.05em" }}
                    >
                      {b.label.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h3
                    className="text-base font-extrabold text-white leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {b.title}
                  </h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed pl-11">{b.body}</p>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Journey / Timeline ──────────────────────────────────────────────────── */
const MILESTONES = [
  {
    year: "2023",
    title: "The Hypothesis",
    body: "What if cookies could teach science? The idea for Kurious Cookie Lab was born in a home kitchen.",
    color: "#FF3DA0",
    label: "Origin",
  },
  {
    year: "2024",
    title: "First Experiments",
    body: "Perfecting recipes, testing STEM facts, and sharing with local schools and events.",
    color: "#4DAEEA",
    label: "Testing",
  },
  {
    year: "2025",
    title: "Going Statewide",
    body: "Launching our ghost kitchen and delivering curiosity-sparking cookies across North Carolina.",
    color: "#3EC9C9",
    label: "Launch",
  },
]

function JourneySection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{ background: "#FAF6F0" }}>
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-2">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Our Journey
          </span>
          <h2 className="leading-tight">
            <span
              className="block text-4xl sm:text-5xl font-extrabold text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From Hypothesis
            </span>
            <span
              className="block text-4xl sm:text-5xl text-[#FF3DA0] mt-1"
              style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
            >
              to Statewide.
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-[28px] sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-px"
            style={{ background: "linear-gradient(to bottom, #FF3DA0, #4DAEEA, #3EC9C9)" }}
          />

          <div className="space-y-12">
            {MILESTONES.map((m, i) => {
              const isRight = i % 2 === 0
              return (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isRight ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Year node */}
                  <div className="relative z-10 shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div
                      className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg bg-white"
                      style={{ borderColor: m.color, boxShadow: `0 4px 20px ${m.color}30` }}
                    >
                      <span
                        className="text-xs font-extrabold leading-none"
                        style={{ fontFamily: "var(--font-display)", color: m.color }}
                      >
                        {m.year}
                      </span>
                      <span
                        className="text-[7px] font-semibold uppercase tracking-wider mt-0.5"
                        style={{ fontFamily: "var(--font-oswald)", color: `${m.color}80` }}
                      >
                        {m.label}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`flex-1 sm:w-[44%] sm:flex-none ${
                      isRight ? "sm:pr-20 sm:text-right" : "sm:pl-20 sm:ml-auto"
                    }`}
                  >
                    <div
                      className="rounded-2xl border-2 bg-white p-6 space-y-2 shadow-sm transition-all hover:-translate-y-0.5"
                      style={{ borderColor: `${m.color}25` }}
                    >
                      <div
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-oswald)", color: m.color }}
                      >
                        {m.year}
                      </div>
                      <h3
                        className="text-xl font-extrabold text-black"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm text-black/50 leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── The Science ─────────────────────────────────────────────────────────── */
const SCIENCE_ELEMENTS = [
  { symbol: "Mr", num: "01", name: "Maillard Reaction", color: "#FF9F43" },
  { symbol: "Ca", num: "02", name: "Caramelization",    color: "#FFD166" },
  { symbol: "Gd", num: "03", name: "Gluten Dev.",       color: "#4DAEEA" },
  { symbol: "Lv", num: "04", name: "Leavening",         color: "#3EC9C9" },
]

function ScienceSection() {
  return (
    <section className="py-24 px-4" style={{ background: "#1a1a4e" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                The Science
              </span>
              <h2 className="leading-tight">
                <span
                  className="block text-3xl sm:text-4xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Why Cookies
                </span>
                <span
                  className="block text-4xl sm:text-5xl text-[#FF66C4] mt-1"
                  style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
                >
                  + STEM?
                </span>
              </h2>
            </div>

            <p className="text-white/60 text-base leading-relaxed">
              Baking is chemistry in action. From the{" "}
              <span className="text-[#FF9F43] font-semibold">Maillard reaction</span>{" "}
              that creates golden-brown perfection to the precise temperatures that
              determine chewiness vs. crispiness — every cookie is a science experiment.
            </p>

            <p className="text-white/60 text-base leading-relaxed">
              We've partnered with educators to create fact cards and activities that
              connect these concepts to real STEM learning. It's{" "}
              <span
                className="text-[#FF66C4]"
                style={{ fontFamily: "var(--font-script)", fontSize: "1.1em" }}
              >
                education disguised as dessert.
              </span>
            </p>

            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/40"
              style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.08em" }}
            >
              PARTNERED WITH EDUCATORS · GUILFORD COUNTY, NC
            </div>
          </div>

          {/* Science element tiles */}
          <div className="grid grid-cols-2 gap-4">
            {SCIENCE_ELEMENTS.map((el) => (
              <div
                key={el.symbol}
                className="rounded-2xl border-2 p-6 space-y-3 group hover:-translate-y-1 transition-all duration-200"
                style={{
                  borderColor: `${el.color}35`,
                  background: `${el.color}08`,
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono" style={{ color: `${el.color}60` }}>
                    {el.num}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: el.color }}
                  />
                </div>
                <div>
                  <span
                    className="text-4xl font-extrabold leading-none block"
                    style={{ fontFamily: "var(--font-display)", color: el.color }}
                  >
                    {el.symbol}
                  </span>
                  <span
                    className="text-[11px] font-semibold block mt-1"
                    style={{ fontFamily: "var(--font-oswald)", color: `${el.color}80`, letterSpacing: "0.06em" }}
                  >
                    {el.name.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-28 px-4 text-center"
      style={{ background: "linear-gradient(140deg, #FF3DA0 0%, #e8007f 60%, #FF66C4 100%)" }}
    >
      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <div className="space-y-3">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Join the Lab
          </span>
          <h2 className="leading-tight">
            <span
              className="block text-4xl sm:text-5xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to Get
            </span>
            <span
              className="block text-5xl sm:text-6xl text-white mt-1"
              style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
            >
              Kurious?
            </span>
          </h2>
          <p className="text-white/70 text-base max-w-sm mx-auto leading-relaxed">
            Join our community of science-loving cookie enthusiasts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="rounded-2xl bg-white text-[#FF3DA0] font-extrabold text-lg px-10 py-4
                       hover:bg-white/90 transition-all shadow-xl hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shop Cookies →
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl border-2 border-white/40 text-white font-extrabold text-lg px-10 py-4
                       hover:bg-white/15 hover:border-white transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
