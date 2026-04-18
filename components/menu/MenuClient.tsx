"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AllergenNotice } from "@/components/ui/allergen-notice"
import { COOKIES } from "@/lib/cookies"
import type { Cookie, CookieGroup } from "@/types"

// ─── Group config ──────────────────────────────────────────────────────────────
const GROUP_META: Record<string, { label: string; color: string; description: string }> = {
  classic:  { label: "Classic",  color: "#4DAEEA", description: "The core formula — always on the menu." },
  seasonal: { label: "Seasonal", color: "#FF9F43", description: "Unstable elements. Here today, gone tomorrow." },
  custom:   { label: "Custom",   color: "#FF3DA0", description: "Special order builds and client formulas." },
  limited:  { label: "Limited",  color: "#3EC9C9", description: "Rare compounds — extremely limited batches." },
}


// ─── Main export ───────────────────────────────────────────────────────────────
export function MenuClient() {
  const [selected, setSelected]       = useState<Cookie | null>(null)
  const [modalOpen, setModalOpen]     = useState(false)
  const [filter, setFilter]           = useState<"all" | CookieGroup>("all")

  const filtered = filter === "all" ? COOKIES : COOKIES.filter((c) => c.group === filter)

  function openCookie(cookie: Cookie) {
    if (cookie.isActive === false) return
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
            <CookieGrid
              cookies={filtered}
              selected={selected}
              onSelect={openCookie}
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

// ─── Cookie Grid ───────────────────────────────────────────────────────────────
function CookieGrid({ cookies, selected, onSelect }: {
  cookies: Cookie[]
  selected: Cookie | null
  onSelect: (c: Cookie) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
      {cookies.map((cookie) => (
        <CookieCard
          key={cookie.id}
          cookie={cookie}
          isSelected={selected?.id === cookie.id}
          onClick={() => onSelect(cookie)}
        />
      ))}
    </div>
  )
}

// ─── Cookie Photo Card ─────────────────────────────────────────────────────────
function CookieCard({ cookie, isSelected, onClick }: { cookie: Cookie; isSelected: boolean; onClick: () => void }) {
  const meta = GROUP_META[cookie.group]
  const inactive = cookie.isActive === false

  return (
    <button
      onClick={inactive ? undefined : onClick}
      disabled={inactive}
      className={[
        "relative w-full overflow-hidden rounded-2xl text-left group select-none",
        "border-2 transition-all duration-200",
        inactive
          ? "opacity-60 cursor-default"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-2xl",
      ].join(" ")}
      style={{
        aspectRatio: "3/4",
        borderColor: isSelected ? meta.color : `${meta.color}35`,
        boxShadow: isSelected
          ? `0 0 0 3px ${meta.color}28, 0 10px 30px ${meta.color}28`
          : `0 2px 14px rgba(0,0,0,0.10)`,
        background: `linear-gradient(145deg, ${meta.color}18, ${meta.color}30)`,
      }}
    >
      {/* Cookie photo */}
      {cookie.imageUrl && (
        <Image
          src={cookie.imageUrl}
          alt={cookie.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />

      {/* Atomic number */}
      <span className="absolute top-2.5 left-3 text-[10px] font-mono text-white/55 leading-none">
        {cookie.atomicNumber}
      </span>

      {/* Symbol badge */}
      <div
        className="absolute top-2 right-2 w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-extrabold backdrop-blur-sm"
        style={{
          borderColor: `${meta.color}90`,
          background: "rgba(0,0,0,0.55)",
          color: meta.color,
          fontFamily: "var(--font-display)",
        }}
      >
        {cookie.symbol}
      </div>

      {/* Coming soon overlay */}
      {inactive && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/20">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-oswald)",
              background: "rgba(0,0,0,0.65)",
              color: meta.color,
              letterSpacing: "0.1em",
            }}
          >
            Coming Soon
          </span>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-1">
        <div
          className="text-sm font-extrabold text-white leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cookie.name}
        </div>
        {!inactive && (
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-sm font-extrabold"
              style={{ color: meta.color, fontFamily: "var(--font-display)" }}
            >
              ${cookie.price.toFixed(2)}
            </span>
            <span
              className="text-[9px] text-white/40 font-medium"
              style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
            >
              / COOKIE
            </span>
          </div>
        )}
      </div>

      {/* Selected inner ring */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2px ${meta.color}` }}
        />
      )}
    </button>
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
