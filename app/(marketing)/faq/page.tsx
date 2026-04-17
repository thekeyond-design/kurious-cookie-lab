import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Glow } from "@/components/ui/glow"
import { FadeIn } from "@/components/ui/fade-in"
import { FAQFilter } from "@/components/faq/FAQFilter"
import type { FAQSection } from "@/components/faq/FAQFilter"

export const metadata = {
  title: "FAQ | Kurious Cookie Lab",
  description: "Frequently asked questions about Kurious Cookie Lab — ordering, allergens, delivery, events, and more.",
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    id: "ordering",
    label: "Ordering",
    symbol: "Or",
    color: "#FF3DA0",
    items: [
      {
        q: "What is the minimum order?",
        a: "Individual packs are one flavor, minimum 4 cookies. Boxes start at 6 cookies — mix and match from our menu. For larger orders or events, we offer 12-packs and custom catering options.",
      },
      {
        q: "Can I customize my box?",
        a: "Absolutely! Use our Build-a-Batch feature to select your favorite flavors. You can create your perfect mix of classic, seasonal, and experimental cookies.",
      },
      {
        q: "How many flavors can I choose per box?",
        a: "For a 6-pack, you can choose up to 2 different flavors. For a 12-pack, up to 3 different flavors. This helps us ensure the freshest possible cookies in every box!",
      },
    ],
  },
  {
    id: "allergens",
    label: "Dietary & Allergens",
    symbol: "Al",
    color: "#FF9F43",
    items: [
      {
        q: "Do you offer gluten-free options?",
        a: "Yes! Look for the \"GF\" label on our menu — those cookies are made with almond flour. Note: our kitchen does process wheat, so while we take precautions, we cannot guarantee zero cross-contamination.",
      },
      {
        q: "Are your cookies nut-free?",
        a: "Many of our cookies are nut-free and clearly labeled. However, our kitchen processes tree nuts (almonds) for our gluten-free cookies. If you have a severe nut allergy, please contact us directly before ordering.",
      },
      {
        q: "Do you have vegan cookies?",
        a: "We're currently developing vegan recipes! Sign up for our newsletter to be the first to know when they launch. Science takes time — but delicious vegan cookies are in our experimental queue.",
      },
      {
        q: "What allergens are in your kitchen?",
        a: "Our kitchen processes: wheat, eggs, dairy, soy, and tree nuts (almonds). Each cookie listing includes ingredient information. Please contact us with specific allergy concerns before placing your order.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Shipping",
    symbol: "Dv",
    color: "#4DAEEA",
    items: [
      {
        q: "Where do you deliver?",
        a: "We offer local pickup and delivery within Guilford County, NC, as well as shipping throughout North Carolina. Contact us for availability in your area.",
      },
      {
        q: "How are cookies packaged?",
        a: "Cookies are individually wrapped or packed in our signature lab-themed boxes with eco-friendly insulation. During summer months, we include ice packs to keep chocolate from melting.",
      },
    ],
  },
  {
    id: "events",
    label: "Events & Workshops",
    symbol: "Ev",
    color: "#3EC9C9",
    items: [
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 2 weeks in advance for standard events. For large corporate events or custom requests, 4+ weeks notice helps us deliver the best experience.",
      },
      {
        q: "Do you offer cookie workshops?",
        a: "Yes! Our interactive workshops include hands-on cookie creation and science demonstrations. Perfect for birthday parties, team building, or school events. Virtual workshop options are available too!",
        badge: "Coming Soon",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen" style={{ background: "#FAF6F0" }}>
        <HeroSection />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16 w-full">
          <FAQFilter sections={FAQ_SECTIONS} />
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 px-4 text-center" style={{ background: "#FAF6F0" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Glow variant="center" className="opacity-40 pointer-events-none" />

      <FadeIn className="relative z-10 max-w-2xl mx-auto space-y-5">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0] border border-[#FF3DA0]/30 rounded-full px-5 py-1.5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Lab Notes
        </span>
        <h1 className="leading-[1.05]">
          <span
            className="block text-5xl sm:text-6xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently Asked
          </span>
          <span
            className="block text-5xl sm:text-6xl text-[#FF3DA0] mt-1"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            Questions.
          </span>
        </h1>
        <p className="text-lg text-black/50 leading-relaxed">
          Everything you need to know before your first experiment.
        </p>
      </FadeIn>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-20 px-4" style={{ background: "#1a1a4e" }}>
      <FadeIn className="max-w-2xl mx-auto text-center space-y-6">
        <div
          className="w-14 h-14 rounded-2xl border-2 border-[#FF3DA0]/40 bg-[#FF3DA0]/10 mx-auto
                     flex flex-col items-center justify-center"
        >
          <span className="text-[8px] font-mono text-[#FF3DA0]/50 self-start ml-2 leading-none">?</span>
          <span
            className="text-xl font-extrabold text-[#FF3DA0] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Qu
          </span>
        </div>

        <h2 className="leading-tight">
          <span
            className="block text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Still have questions?
          </span>
          <span
            className="block text-3xl sm:text-4xl text-[#FF66C4] mt-1"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            We&apos;re here to help.
          </span>
        </h2>

        <p className="text-white/50 text-base leading-relaxed">
          Can&apos;t find what you&apos;re looking for? Reach out directly — we read every message.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="rounded-2xl bg-[#FF3DA0] text-white font-extrabold text-base px-8 py-3.5
                       hover:bg-[#FF66C4] transition-all shadow-lg hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact Us →
          </Link>
          <Link
            href="/order"
            className="rounded-2xl border-2 border-white/20 text-white/70 font-extrabold text-base px-8 py-3.5
                       hover:border-[#FF3DA0] hover:text-white transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start an Order
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
