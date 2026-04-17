"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ShoppingBag, User, ChevronDown } from "lucide-react"

const ELEMENTS_DROPDOWN = [
  {
    label: "Cookiodic Table",
    sub: "Browse all flavors",
    href: "/menu",
    symbol: "Ct",
    color: "#FF3DA0",
  },
  {
    label: "Build-A-Batch",
    sub: "Custom order builder",
    href: "/order",
    symbol: "Bb",
    color: "#4DAEEA",
  },
]

const LEFT_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Events", href: "/events", badge: "Soon" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const elementsActive = pathname.startsWith("/menu") || pathname.startsWith("/order")

  return (
    <header
      className="w-full border-b border-black/8 bg-[#FAF6F0]/95 backdrop-blur-sm sticky top-0 z-50 transition-shadow duration-300"
      style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 relative flex items-center">

        {/* ── Left nav ─────────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 flex-1">

          {/* The Elements dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: elementsActive ? "#FF3DA0" : "rgba(0,0,0,0.6)" }}
            >
              The Elements
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
              {elementsActive && (
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: "#FF3DA0" }}
                />
              )}
            </button>

            {/* Dropdown panel */}
            <div
              className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-black/8 bg-white shadow-xl overflow-hidden transition-all duration-200 origin-top-left"
              style={{
                opacity: dropdownOpen ? 1 : 0,
                transform: dropdownOpen ? "scale(1) translateY(0)" : "scale(0.96) translateY(-8px)",
                pointerEvents: dropdownOpen ? "auto" : "none",
              }}
            >
              <div className="p-2 space-y-1">
                {ELEMENTS_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ borderColor: item.color, background: `${item.color}10` }}
                    >
                      <span
                        className="text-xs font-extrabold leading-none"
                        style={{ color: item.color, fontFamily: "var(--font-display)" }}
                      >
                        {item.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                        {item.label}
                      </p>
                      <p className="text-xs text-black/40">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-black/5 px-4 py-2.5">
                <p className="text-[10px] text-black/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
                  Batch to Order · Guilford County, NC
                </p>
              </div>
            </div>
          </div>

          {/* Other left links */}
          {LEFT_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: active ? "#FF3DA0" : "rgba(0,0,0,0.6)" }}
              >
                {link.label}
                {link.badge && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: "#FF9F4325", color: "#FF9F43", fontFamily: "var(--font-oswald)" }}
                  >
                    {link.badge}
                  </span>
                )}
                {active && (
                  <span
                    className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: "#FF3DA0" }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* ── Center logo ───────────────────────────────────────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="block">
            <span
              className="text-xl leading-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-adws, var(--font-display))", letterSpacing: "0.04em" }}
            >
              Kurious<span className="text-[#FF3DA0]">Cookie</span>
              <span className="text-black/35 font-semibold"> Lab</span>
            </span>
          </Link>
        </div>

        {/* ── Right actions ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Sign In */}
          <Link
            href="/account"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-black/60 hover:text-black transition-colors"
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 bg-white hover:border-[#FF3DA0] hover:text-[#FF3DA0] transition-all text-black/50"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-black/70 rounded transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-black/70 rounded transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-black/70 rounded transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <div
        className="md:hidden border-t border-black/8 bg-[#FAF6F0] overflow-hidden transition-all duration-300"
        style={{ maxHeight: mobileOpen ? "600px" : "0" }}
      >
        <div className="px-4 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/25 px-3 pb-1" style={{ fontFamily: "var(--font-oswald)" }}>
            The Elements
          </p>
          {ELEMENTS_DROPDOWN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors"
              style={{ background: pathname.startsWith(item.href) ? `${item.color}10` : "transparent" }}
            >
              <div
                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: item.color, background: `${item.color}10` }}
              >
                <span className="text-[10px] font-extrabold" style={{ color: item.color, fontFamily: "var(--font-display)" }}>
                  {item.symbol}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-black">{item.label}</p>
                <p className="text-xs text-black/40">{item.sub}</p>
              </div>
            </Link>
          ))}

          <div className="h-px bg-black/6 my-2" />

          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: pathname === link.href ? "#FF3DA0" : "rgba(0,0,0,0.65)" }}
            >
              {link.label}
              {link.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FF9F4320", color: "#FF9F43" }}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="h-px bg-black/6 my-2" />

          <Link
            href="/account"
            className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold text-black/60"
          >
            <User className="w-4 h-4" />
            Sign In / Account
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold text-black/60"
          >
            <ShoppingBag className="w-4 h-4" />
            Cart
          </Link>
        </div>
      </div>
    </header>
  )
}
