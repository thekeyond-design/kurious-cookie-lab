"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AllergenNotice } from "@/components/ui/allergen-notice"
import { COOKIES, GROUP_COLORS } from "@/lib/cookies"
import type { Cookie, CookieGroup } from "@/types"

// ─── Group config ──────────────────────────────────────────────────────────────
const GROUP_META: Record<string, { label: string; color: string; description: string }> = {
  classic:  { label: "Classic",  color: "#4DAEEA", description: "The core formula — always on the menu." },
  seasonal: { label: "Seasonal", color: "#FF9F43", description: "Unstable elements. Here today, gone tomorrow." },
  custom:   { label: "Custom",   color: "#FF3DA0", description: "Special order builds and client formulas." },
  limited:  { label: "Limited",  color: "#3EC9C9", description: "Rare compounds — extremely limited batches." },
}

const PLACEHOLDER_TILES = [
  { num: 7, label: "New Element" },
  { num: 8, label: "New Element" },
  { num: 9, label: "Unstable" },
  { num: 10, label: "Unstable" },
]

// ─── Main export ───────────────────────────────────────────────────────────────
export function MenuClient() {
  const [selected, setSelected]       = useState<Cookie | null>(null)
  const [modalOpen, setModalOpen]     = useState(false)
  const [filter, setFilter]           = useState<"all" | CookieGroup>("all")

  const filtered = filter === "all" ? COOKIES : COOKIES.filter((c) => c.group === filter)

  function openCookie(cookie: Cookie) {
    setSelected(cookie)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setTimeout(() => setSelected(null), 300)
  }

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [modalOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") closeModal() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FAF6F0" }}>
        <PageHeader />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <FilterTabs filter={filter} onFilter={setFilter} />

          <div className="mt-8 space-y-8">
            <ElementGrid
              cookies={filtered}
              selected={selected}
              onSelect={openCookie}
              filter={filter}
            />
            <UnstableTeaser />
          </div>
        </section>

        {/* Allergen notice — slim, above footer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <AllergenNotice className="text-xs py-3 px-4" />
        </div>
      </main>
      <Footer />

      {/* ── Cookie modal ─────────────────────────────────────────────────── */}
      {selected && (
        <CookieModal cookie={selected} isOpen={modalOpen} onClose={closeModal} />
      )}
    </>
  )
}

// ─── Cookie Modal ──────────────────────────────────────────────────────────────
function CookieModal({ cookie, isOpen, onClose }: { cookie: Cookie; isOpen: boolean; onClose: () => void }) {
  const meta = GROUP_META[cookie.group]
  const groupColor = meta?.color ?? "#FF3DA0"

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed z-50 inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div
          className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          style={{
            transform: isOpen ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
            opacity: isOpen ? 1 : 0,
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm
                       flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Photo */}
          <div
            className="relative w-full aspect-[4/3]"
            style={{ background: `linear-gradient(140deg, ${groupColor}22 0%, ${groupColor}44 100%)` }}
          >
            {cookie.imageUrl ? (
              <Image
                src={cookie.imageUrl}
                alt={cookie.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[100px] font-extrabold leading-none select-none"
                  style={{ fontFamily: "var(--font-display)", color: `${groupColor}20` }}
                >
                  {cookie.symbol}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

            {/* Atomic badge */}
            <span className="absolute top-3 left-3 text-xs font-mono text-white/80 drop-shadow">
              #{cookie.atomicNumber}
            </span>
            {/* Group badge */}
            <span
              className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{
                fontFamily: "var(--font-oswald)",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              {meta?.label}
            </span>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            {/* Name row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  className="text-2xl font-extrabold text-black leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cookie.name}
                </h2>
                <p className="text-sm text-black/40 mt-0.5">{meta?.description}</p>
              </div>
              <div
                className="shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center text-base font-extrabold"
                style={{
                  fontFamily: "var(--font-display)",
                  borderColor: `${groupColor}50`,
                  color: groupColor,
                  background: `${groupColor}12`,
                }}
              >
                {cookie.symbol}
              </div>
            </div>

            <p className="text-sm text-black/60 leading-relaxed">{cookie.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: groupColor }}
              >
                ${cookie.price.toFixed(2)}
              </span>
              <span className="text-xs text-black/35 font-medium">per cookie</span>
            </div>

            {/* CTA */}
            <Link
              href={`/order?start=${cookie.slug}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl font-bold text-sm py-3.5 text-white
                         transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: groupColor, fontFamily: "var(--font-display)" }}
            >
              Add to Your Formula →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Page Header ───────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="relative overflow-hidden py-20 px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto space-y-5">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0] border border-[#FF3DA0]/30 rounded-full px-5 py-1.5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          The Periodic Table of Cookies
        </span>
        <h1 className="leading-[1.05]">
          <span
            className="block text-5xl sm:text-6xl font-extrabold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every Element,
          </span>
          <span
            className="block text-5xl sm:text-6xl text-[#FF3DA0] mt-1"
            style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
          >
            Perfectly Balanced.
          </span>
        </h1>
        <p className="text-lg text-black/45 max-w-lg mx-auto leading-relaxed">
          Six core elements, each a carefully tested formula. Click any tile to explore — then build your batch.
        </p>
      </div>
    </div>
  )
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────
function FilterTabs({ filter, onFilter }: { filter: "all" | CookieGroup; onFilter: (f: "all" | CookieGroup) => void }) {
  const tabs = [
    { key: "all",      label: "All Elements", color: "#1a1a4e" },
    { key: "classic",  label: "Classic",      color: GROUP_META.classic.color },
    { key: "seasonal", label: "Seasonal",     color: GROUP_META.seasonal.color },
    { key: "custom",   label: "Custom",       color: GROUP_META.custom.color },
    { key: "limited",  label: "Limited",      color: GROUP_META.limited.color },
  ] as const

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = filter === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onFilter(tab.key)}
            className="rounded-full px-4 py-2 text-xs font-semibold transition-all border-2"
            style={{
              fontFamily: "var(--font-oswald)",
              letterSpacing: "0.08em",
              borderColor: active ? tab.color : "transparent",
              backgroundColor: active ? `${tab.color}15` : "white",
              color: active ? tab.color : "#00000060",
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Element Grid ──────────────────────────────────────────────────────────────
function ElementGrid({ cookies, selected, onSelect, filter }: {
  cookies: Cookie[]
  selected: Cookie | null
  onSelect: (c: Cookie) => void
  filter: "all" | CookieGroup
}) {
  const showPlaceholders = filter === "all" || filter === "seasonal"
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {Object.entries(GROUP_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: meta.color }} />
            <span className="text-[11px] font-semibold text-black/40 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-oswald)" }}>
              {meta.label}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {cookies.map((cookie) => (
          <ElementTile
            key={cookie.id}
            cookie={cookie}
            isSelected={selected?.id === cookie.id}
            onClick={() => onSelect(cookie)}
          />
        ))}
        {showPlaceholders &&
          PLACEHOLDER_TILES.map((p) => <PlaceholderTile key={p.num} num={p.num} label={p.label} />)}
      </div>
    </div>
  )
}

// ─── Element Tile ──────────────────────────────────────────────────────────────
function ElementTile({ cookie, isSelected, onClick }: { cookie: Cookie; isSelected: boolean; onClick: () => void }) {
  const colors = GROUP_COLORS[cookie.group]
  const meta = GROUP_META[cookie.group]

  return (
    <button
      onClick={onClick}
      className={[
        "relative aspect-square flex flex-col items-center justify-center gap-0.5",
        "rounded-xl border-2 p-2 cursor-pointer select-none",
        "transition-all duration-200 group",
        colors.bg, colors.text,
        isSelected ? "scale-105 shadow-xl" : "hover:-translate-y-1 hover:shadow-md",
        cookie.isUnstable ? "element-tile unstable" : "",
      ].join(" ")}
      style={{
        borderColor: isSelected ? meta.color : `${meta.color}70`,
        boxShadow: isSelected
          ? `0 0 0 3px ${meta.color}40, 0 8px 24px ${meta.color}30`
          : `0 2px 8px ${meta.color}15`,
      }}
    >
      <span className="absolute top-1.5 left-2 text-[9px] font-mono opacity-40 leading-none">
        {cookie.atomicNumber}
      </span>
      {cookie.isUnstable && (
        <span
          className="absolute top-1.5 right-1.5 text-[8px] font-bold uppercase leading-none px-1 py-0.5 rounded"
          style={{ fontFamily: "var(--font-oswald)", background: `${meta.color}25`, color: meta.color }}
        >
          ⚡
        </span>
      )}
      <span
        className="text-2xl sm:text-4xl font-extrabold leading-none mt-3"
        style={{ fontFamily: "var(--font-display)", color: meta.color }}
      >
        {cookie.symbol}
      </span>
      <span className="text-[10px] font-bold leading-tight text-center px-0.5 opacity-75 line-clamp-2"
        style={{ fontFamily: "var(--font-sans)" }}>
        {cookie.name}
      </span>
      <span className="text-[9px] font-bold mt-0.5" style={{ fontFamily: "var(--font-oswald)", color: meta.color }}>
        ${cookie.price.toFixed(2)}
      </span>
      {isSelected && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
      )}
    </button>
  )
}

// ─── Placeholder Tile ──────────────────────────────────────────────────────────
function PlaceholderTile({ num, label }: { num: number; label: string }) {
  return (
    <div className="relative aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/10 p-2 opacity-40 cursor-not-allowed">
      <span className="absolute top-1.5 left-2 text-[9px] font-mono opacity-40 leading-none">{num}</span>
      <span className="text-2xl font-extrabold text-black/20 leading-none mt-3" style={{ fontFamily: "var(--font-display)" }}>?</span>
      <span className="text-[8px] font-medium text-center text-black/30 leading-tight" style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
        {label}
      </span>
    </div>
  )
}

// ─── Unstable Teaser ───────────────────────────────────────────────────────────
function UnstableTeaser() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#FF9F43]/30 p-6 space-y-3" style={{ background: "#FF9F4308" }}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center text-sm font-extrabold animate-pulse"
          style={{ fontFamily: "var(--font-display)", borderColor: "#FF9F43", color: "#FF9F43" }}
        >
          ?
        </div>
        <div>
          <h3 className="font-extrabold text-base text-black" style={{ fontFamily: "var(--font-display)" }}>
            Unstable Elements
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF9F43]" style={{ fontFamily: "var(--font-oswald)" }}>
            Seasonal · Limited
          </span>
        </div>
      </div>
      <p className="text-sm text-black/45 leading-relaxed">
        Seasonal and limited-run cookies rotate throughout the year. These{" "}
        <span className="text-[#FF9F43]" style={{ fontFamily: "var(--font-script)", fontSize: "1.1em" }}>
          unstable elements
        </span>{" "}
        drop without warning — follow us to catch them before they decay.
      </p>
      <div className="flex gap-3">
        <a
          href="https://www.instagram.com/kuriouscookielab/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#FF9F43] border border-[#FF9F43]/40 rounded-full px-4 py-1.5 hover:bg-[#FF9F43]/10 transition-colors"
          style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
        >
          Follow on Instagram
        </a>
      </div>
    </div>
  )
}
