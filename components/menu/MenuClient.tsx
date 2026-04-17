"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { GlowCard } from "@/components/ui/glow-card"
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

// Placeholder tiles for upcoming elements
const PLACEHOLDER_TILES = [
  { num: 7, label: "New Element" },
  { num: 8, label: "New Element" },
  { num: 9, label: "Unstable" },
  { num: 10, label: "Unstable" },
]

// ─── Main export ───────────────────────────────────────────────────────────────
export function MenuClient() {
  const [selected, setSelected] = useState<Cookie>(COOKIES[0])
  const [filter, setFilter] = useState<"all" | CookieGroup>("all")

  const filtered =
    filter === "all"
      ? COOKIES
      : COOKIES.filter((c) => c.group === filter)

  const groupColor = GROUP_META[selected.group]?.color ?? "#FF3DA0"

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FAF6F0" }}>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <PageHeader />

        {/* ── Table + Detail ───────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          {/* Filter legend */}
          <FilterTabs filter={filter} onFilter={setFilter} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Periodic table grid */}
            <div className="space-y-6">
              <ElementGrid
                cookies={filtered}
                selected={selected}
                onSelect={setSelected}
                filter={filter}
              />

              {/* Unstable / Coming section */}
              <UnstableTeaser />

              {/* Allergen notice */}
              <AllergenNotice />
            </div>

            {/* Sticky detail panel */}
            <div className="lg:sticky lg:top-24">
              <DetailPanel cookie={selected} groupColor={groupColor} />
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <BuildCTA />
      </main>
      <Footer />
    </>
  )
}

// ─── Page Header ───────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="relative overflow-hidden py-20 px-4 text-center">
      {/* Subtle dot grid */}
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
          Six core elements, each a carefully tested formula. Click any tile
          to explore the compound — then build your batch.
        </p>
      </div>
    </div>
  )
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────
function FilterTabs({
  filter,
  onFilter,
}: {
  filter: "all" | CookieGroup
  onFilter: (f: "all" | CookieGroup) => void
}) {
  const tabs = [
    { key: "all", label: "All Elements", color: "#1a1a4e" },
    { key: "classic",  label: "Classic",  color: GROUP_META.classic.color },
    { key: "seasonal", label: "Seasonal", color: GROUP_META.seasonal.color },
    { key: "custom",   label: "Custom",   color: GROUP_META.custom.color },
    { key: "limited",  label: "Limited",  color: GROUP_META.limited.color },
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
function ElementGrid({
  cookies,
  selected,
  onSelect,
  filter,
}: {
  cookies: Cookie[]
  selected: Cookie
  onSelect: (c: Cookie) => void
  filter: "all" | CookieGroup
}) {
  const showPlaceholders = filter === "all" || filter === "seasonal"

  return (
    <div className="space-y-4">
      {/* Legend key */}
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

      {/* Tiles grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {cookies.map((cookie) => (
          <ElementTile
            key={cookie.id}
            cookie={cookie}
            isSelected={selected.id === cookie.id}
            onClick={() => onSelect(cookie)}
          />
        ))}
        {/* Coming soon placeholders */}
        {showPlaceholders &&
          PLACEHOLDER_TILES.map((p) => <PlaceholderTile key={p.num} num={p.num} label={p.label} />)}
      </div>
    </div>
  )
}

// ─── Element Tile ──────────────────────────────────────────────────────────────
function ElementTile({
  cookie,
  isSelected,
  onClick,
}: {
  cookie: Cookie
  isSelected: boolean
  onClick: () => void
}) {
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
        isSelected
          ? "scale-105 shadow-xl"
          : "hover:-translate-y-1 hover:shadow-md",
        cookie.isUnstable ? "element-tile unstable" : "",
      ].join(" ")}
      style={{
        borderColor: isSelected ? meta.color : `${meta.color}70`,
        boxShadow: isSelected ? `0 0 0 3px ${meta.color}40, 0 8px 24px ${meta.color}30` : `0 2px 8px ${meta.color}15`,
      }}
    >
      {/* Atomic number */}
      <span className="absolute top-1.5 left-2 text-[9px] font-mono opacity-40 leading-none">
        {cookie.atomicNumber}
      </span>

      {/* Unstable indicator */}
      {cookie.isUnstable && (
        <span
          className="absolute top-1.5 right-1.5 text-[8px] font-bold uppercase leading-none px-1 py-0.5 rounded"
          style={{ fontFamily: "var(--font-oswald)", background: `${meta.color}25`, color: meta.color }}
        >
          ⚡
        </span>
      )}

      {/* Symbol */}
      <span
        className="text-2xl sm:text-4xl font-extrabold leading-none mt-3"
        style={{ fontFamily: "var(--font-display)", color: meta.color }}
      >
        {cookie.symbol}
      </span>

      {/* Name */}
      <span className="text-[10px] font-bold leading-tight text-center px-0.5 opacity-75 line-clamp-2"
        style={{ fontFamily: "var(--font-sans)" }}>
        {cookie.name}
      </span>

      {/* Price */}
      <span
        className="text-[9px] font-bold mt-0.5"
        style={{ fontFamily: "var(--font-oswald)", color: meta.color }}
      >
        ${cookie.price.toFixed(2)}
      </span>

      {/* Selected indicator dot */}
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
      <span
        className="text-2xl font-extrabold text-black/20 leading-none mt-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ?
      </span>
      <span className="text-[8px] font-medium text-center text-black/30 leading-tight"
        style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
        {label}
      </span>
    </div>
  )
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ cookie, groupColor }: { cookie: Cookie; groupColor: string }) {
  const meta = GROUP_META[cookie.group]

  return (
    <GlowCard
      customSize
      glowColor="pink"
      className="w-full !aspect-auto !rounded-2xl overflow-hidden bg-white"
    >
      {/* Photo */}
      <div
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden"
        style={{ background: `linear-gradient(140deg, ${groupColor}22 0%, ${groupColor}44 100%)` }}
      >
        {cookie.imageUrl ? (
          <Image
            key={cookie.id}
            src={cookie.imageUrl}
            alt={cookie.name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 380px"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span
              className="text-[100px] font-extrabold leading-none select-none"
              style={{ fontFamily: "var(--font-display)", color: `${groupColor}20` }}
            >
              {cookie.symbol}
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-oswald)", color: `${groupColor}60` }}
            >
              Photo Coming Soon
            </span>
          </div>
        )}
        {/* Atomic number overlay */}
        <span className="absolute top-3 left-3 text-xs font-mono z-10" style={{ color: cookie.imageUrl ? "white" : `${groupColor}60`, textShadow: cookie.imageUrl ? "0 1px 3px rgba(0,0,0,0.5)" : "none" }}>
          #{cookie.atomicNumber}
        </span>
        {/* Group badge */}
        <span
          className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
          style={{
            fontFamily: "var(--font-oswald)",
            background: cookie.imageUrl ? "rgba(0,0,0,0.45)" : `${groupColor}20`,
            color: cookie.imageUrl ? "white" : groupColor,
            border: cookie.imageUrl ? "none" : `1px solid ${groupColor}40`,
            backdropFilter: cookie.imageUrl ? "blur(4px)" : "none",
          }}
        >
          {meta?.label}
        </span>
        {/* Unstable badge */}
        {cookie.isUnstable && (
          <span
            className="absolute bottom-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              fontFamily: "var(--font-oswald)",
              background: `${groupColor}25`,
              color: groupColor,
            }}
          >
            Unstable Element
          </span>
        )}
        {/* Gradient overlay on real photos so text reads cleanly */}
        {cookie.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-[1]" />
        )}
      </div>

      {/* Info */}
      <div className="space-y-4 pt-2 pb-1 px-1">
        {/* Name + symbol row */}
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

        {/* Description */}
        <p className="text-sm text-black/55 leading-relaxed">{cookie.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-extrabold"
            style={{ fontFamily: "var(--font-display)", color: groupColor }}
          >
            ${cookie.price.toFixed(2)}
          </span>
          <span className="text-xs text-black/35 font-medium">per cookie</span>
        </div>

        {/* CTA */}
        <div className="space-y-2 pt-1">
          <Link
            href={`/order?start=${cookie.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl font-bold text-sm py-3.5 text-white
                       transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
            style={{
              backgroundColor: groupColor,
              fontFamily: "var(--font-display)",
            }}
          >
            Add to Your Formula →
          </Link>
          <p
            className="text-center text-[10px] text-black/30 font-medium uppercase tracking-widest"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Individual · Minimum order of 4 cookies
          </p>
        </div>
      </div>
    </GlowCard>
  )
}

// ─── Unstable Teaser ───────────────────────────────────────────────────────────
function UnstableTeaser() {
  return (
    <div
      className="rounded-2xl border-2 border-dashed border-[#FF9F43]/30 p-6 space-y-3"
      style={{ background: "#FF9F4308" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center text-sm font-extrabold animate-pulse"
          style={{
            fontFamily: "var(--font-display)",
            borderColor: "#FF9F43",
            color: "#FF9F43",
          }}
        >
          ?
        </div>
        <div>
          <h3
            className="font-extrabold text-base text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Unstable Elements
          </h3>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-[#FF9F43]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Seasonal · Limited
          </span>
        </div>
      </div>
      <p className="text-sm text-black/45 leading-relaxed">
        Seasonal and limited-run cookies rotate throughout the year. These{" "}
        <span
          className="text-[#FF9F43]"
          style={{ fontFamily: "var(--font-script)", fontSize: "1.1em" }}
        >
          unstable elements
        </span>{" "}
        drop without warning — follow us to catch them before they decay.
      </p>
      <div className="flex gap-3">
        <a
          href="#"
          className="text-xs font-bold text-[#FF9F43] border border-[#FF9F43]/40 rounded-full px-4 py-1.5 hover:bg-[#FF9F43]/10 transition-colors"
          style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
        >
          Follow on Instagram
        </a>
        <a
          href="#"
          className="text-xs font-bold text-[#FF9F43] border border-[#FF9F43]/40 rounded-full px-4 py-1.5 hover:bg-[#FF9F43]/10 transition-colors"
          style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
        >
          Follow on TikTok
        </a>
      </div>
    </div>
  )
}

// ─── Build CTA ─────────────────────────────────────────────────────────────────
function BuildCTA() {
  return (
    <section className="py-24 px-4" style={{ background: "#1a1a4e" }}>
      <div className="max-w-3xl mx-auto text-center space-y-7">
        <span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Ready to Order
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
        <p className="text-base text-white/40 max-w-sm mx-auto leading-relaxed">
          Choose a box size, select your elements, and we synthesize your batch fresh to order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/order"
            className="rounded-2xl bg-[#FF3DA0] text-white font-bold text-lg px-10 py-4
                       hover:bg-[#FF66C4] transition-all shadow-xl hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start Your Experiment →
          </Link>
          <Link
            href="/"
            className="rounded-2xl border-2 border-white/20 text-white/70 font-bold text-lg px-10 py-4
                       hover:border-white/40 hover:text-white transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
