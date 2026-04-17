"use client"

import Link from "next/link"

const occasions = [
  { num: "01", label: "Treating Yourself", sub: "Because you deserve it.",       href: "/order",   color: "#FF3DA0" },
  { num: "02", label: "As a Gift",         sub: "Ship it. They'll love it.",      href: "/order",   color: "#4DAEEA" },
  { num: "03", label: "For an Event",      sub: "Birthdays, parties, offices.",   href: "/order",   color: "#FF9F43" },
  { num: "04", label: "Corporate",         sub: "Branded and bulk orders.",       href: "/contact", color: "#3EC9C9" },
]

export function OccasionsSection() {
  return (
    <section className="py-16 px-4" style={{ background: "#FAF6F0" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF3DA0]">What's the occasion?</span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every Batch Has a Purpose
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {occasions.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              className="group rounded-2xl bg-white border-2 border-transparent p-5 text-center
                         space-y-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = o.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                style={{ background: `${o.color}18`, border: `2px solid ${o.color}40` }}
              >
                <span className="text-[10px] font-black" style={{ color: o.color, fontFamily: "var(--font-display)" }}>
                  {o.num}
                </span>
              </div>
              <p className="font-bold text-sm text-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                {o.label}
              </p>
              <p className="text-xs text-black/45 leading-snug">{o.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
