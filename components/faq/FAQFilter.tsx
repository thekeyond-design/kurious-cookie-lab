"use client"

import { useState } from "react"
import { FadeIn } from "@/components/ui/fade-in"

type FAQItem = { q: string; a: string; badge?: string }
export type FAQSection = {
  id: string
  label: string
  symbol: string
  color: string
  items: FAQItem[]
}

export function FAQFilter({ sections }: { sections: FAQSection[] }) {
  const [active, setActive] = useState<string | null>(null)

  const visible = active ? sections.filter((s) => s.id === active) : sections

  return (
    <div className="space-y-8">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        <button
          onClick={() => setActive(null)}
          className="rounded-full px-4 py-1.5 text-xs font-bold border-2 transition-all hover:-translate-y-0.5 shadow-sm"
          style={{
            fontFamily: "var(--font-oswald)",
            letterSpacing: "0.1em",
            background: active === null ? "#1a1a4e" : "white",
            borderColor: active === null ? "#1a1a4e" : "rgba(0,0,0,0.15)",
            color: active === null ? "white" : "rgba(0,0,0,0.75)",
            boxShadow: active === null ? "0 2px 8px rgba(26,26,78,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          All Topics
        </button>
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => setActive(isActive ? null : s.id)}
              className="rounded-full px-4 py-1.5 text-xs font-bold border-2 transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: "var(--font-oswald)",
                letterSpacing: "0.1em",
                background: isActive ? s.color : "white",
                borderColor: isActive ? s.color : "rgba(0,0,0,0.15)",
                color: isActive ? "white" : "rgba(0,0,0,0.75)",
                boxShadow: isActive ? `0 2px 8px ${s.color}50` : "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Sections with show/hide animation */}
      <div className="space-y-14">
        {sections.map((section, si) => {
          const isVisible = active === null || active === section.id
          return (
            <div
              key={section.id}
              id={section.id}
              style={{
                maxHeight: isVisible ? "2000px" : "0px",
                opacity: isVisible ? 1 : 0,
                overflow: "hidden",
                transition: isVisible
                  ? "max-height 0.5s ease, opacity 0.35s ease"
                  : "max-height 0.35s ease, opacity 0.2s ease",
                marginBottom: isVisible ? undefined : "0",
              }}
            >
              <FadeIn delay={si * 60}>
                {/* Section header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="relative w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center shrink-0"
                    style={{ borderColor: section.color, background: `${section.color}10` }}
                  >
                    <span
                      className="absolute top-1 left-1.5 text-[8px] font-mono leading-none"
                      style={{ color: `${section.color}70` }}
                    >
                      {si + 1}
                    </span>
                    <span
                      className="text-sm font-extrabold leading-none"
                      style={{ color: section.color, fontFamily: "var(--font-display)" }}
                    >
                      {section.symbol}
                    </span>
                  </div>
                  <h2
                    className="text-xl font-extrabold text-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.label}
                  </h2>
                </div>

                {/* Accordion items */}
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <AccordionItem key={i} item={item} color={section.color} />
                  ))}
                </div>
              </FadeIn>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AccordionItem({ item, color }: { item: FAQItem; color: string }) {
  return (
    <details
      className="group rounded-2xl border-2 bg-white overflow-hidden transition-all"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <summary
        className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none list-none
                   hover:bg-black/[0.02] transition-colors"
      >
        <span className="flex items-center gap-2 flex-wrap">
          <span
            className="font-extrabold text-sm text-black leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item.q}
          </span>
          {item.badge && (
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ fontFamily: "var(--font-oswald)", background: "#FF9F4320", color: "#FF9F43" }}
            >
              {item.badge}
            </span>
          )}
        </span>
        <span
          className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                     transition-transform duration-300 group-open:rotate-45"
          style={{ borderColor: `${color}50`, color }}
        >
          +
        </span>
      </summary>
      <div className="px-6 pb-5">
        <div className="h-px mb-4" style={{ background: `${color}20` }} />
        <p className="text-sm text-black/60 leading-relaxed">{item.a}</p>
      </div>
    </details>
  )
}
