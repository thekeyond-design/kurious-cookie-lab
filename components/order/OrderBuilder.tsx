"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Cookie, BOX_CONFIG, FulfillmentType } from "@/types"
import { COOKIES, GROUP_COLORS } from "@/lib/cookies"
import { PeriodicTable } from "@/components/lab/PeriodicTable"
import { AllergenNotice } from "@/components/ui/allergen-notice"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const FEATURED_SIZES = [0, 6, 12]
const ALL_SIZES = [0, 6, 12, 20, 26, 32]
const MAX_INSTRUCTIONS = 500

const FULFILLMENT_OPTIONS: { value: FulfillmentType; label: string; sub: string; fee: string }[] = [
  { value: "pickup",            label: "Pickup",            sub: "Guilford County, NC",  fee: "Free" },
  { value: "local_delivery",    label: "Local Delivery",    sub: "Guilford County area", fee: "TBD" },
  { value: "nc_shipping",       label: "NC Shipping",       sub: "North Carolina",       fee: "TBD" },
]

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ─── Decorative floating tiles ────────────────────────────────────────────────
function FloatingTile({ symbol, top, left, right, bottom, rotate, opacity }: {
  symbol: string; top?: string; left?: string; right?: string; bottom?: string
  rotate: string; opacity: number
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 border-[#FF3DA0] ${rotate}`}
      style={{ top, left, right, bottom, opacity }}
    >
      <span className="text-2xl font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
        {symbol}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OrderBuilder() {
  const searchParams = useSearchParams()

  const [boxSize, setBoxSize]           = useState<number>(6)
  const [selectedIds, setSelectedIds]   = useState<string[]>([])
  const [showMore, setShowMore]         = useState(false)
  const [instructions, setInstructions] = useState("")
  const [fulfillment, setFulfillment]   = useState<FulfillmentType | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [checkoutError, setCheckoutError] = useState("")

  // Pre-select cookie from ?start= URL param
  useEffect(() => {
    const slug = searchParams.get("start")
    if (!slug) return
    const cookie = COOKIES.find((c) => c.slug === slug)
    if (cookie && !selectedIds.includes(cookie.id)) {
      setSelectedIds([cookie.id])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleSizes    = showMore ? ALL_SIZES : FEATURED_SIZES
  const config          = BOX_CONFIG[boxSize]
  const emailValid      = isValidEmail(customerEmail)
  const emailError      = emailTouched && customerEmail.length > 0 && !emailValid
  const canCheckout     = selectedIds.length > 0 && fulfillment !== null
  const canSubmit       = canCheckout && customerName.trim().length > 0 && emailValid

  // Which step is furthest complete (for progress bar)
  const progressStep = emailValid && customerName.trim()
    ? 5 : fulfillment ? 4 : selectedIds.length > 0 ? 3 : boxSize ? 2 : 1

  async function handleCheckout() {
    setLoading(true)
    setCheckoutError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boxSize,
          selectedCookieIds: selectedIds,
          instructions,
          fulfillment,
          customerName,
          customerEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? "Something went wrong.")
      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  function toggleCookie(cookie: Cookie) {
    setSelectedIds((prev) => {
      if (prev.includes(cookie.id)) return prev.filter((id) => id !== cookie.id)
      if (prev.length >= config.maxFlavors) return prev
      return [...prev, cookie.id]
    })
  }

  function handleSizeChange(size: number) {
    setBoxSize(size)
    setSelectedIds((prev) => prev.slice(0, BOX_CONFIG[size].maxFlavors))
  }

  const selectedCookies = COOKIES.filter((c) => selectedIds.includes(c.id))
  const atMax = selectedIds.length >= config.maxFlavors && config.maxFlavors > 0

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#FAF6F0" }}>

      {/* ── Decorative background ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <FloatingTile symbol="Cc"  top="8%"    left="2%"   rotate="-rotate-12" opacity={0.08} />
      <FloatingTile symbol="PbO" top="30%"   right="2%"  rotate="rotate-6"   opacity={0.07} />
      <FloatingTile symbol="Dc"  bottom="25%" left="1%"  rotate="rotate-12"  opacity={0.06} />
      <FloatingTile symbol="Sn"  bottom="10%" right="3%" rotate="-rotate-6"  opacity={0.08} />


      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* Back link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-[#FF3DA0] transition-colors mb-8 group"
          style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Elements
        </Link>

        {/* Page header */}
        <div className="mb-10 space-y-2">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            The Order Builder
          </span>
          <h1 className="leading-none">
            <span className="block text-4xl sm:text-5xl font-extrabold text-black"
              style={{ fontFamily: "var(--font-display)" }}>
              Build Your
            </span>
            <span className="block text-4xl sm:text-5xl text-[#FF3DA0] mt-1"
              style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}>
              Formula.
            </span>
          </h1>
        </div>

        {/* Progress indicator */}
        <ProgressBar step={progressStep} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── Steps column ──────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Step 1 — Batch Size */}
            <StepCard number={1} label="Choose Your Batch Size">
              <div className="flex flex-wrap gap-3">
                {visibleSizes.map((size) => {
                  const c = BOX_CONFIG[size]
                  const active = boxSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className="flex-1 min-w-[130px] rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150 hover:-translate-y-0.5 relative overflow-hidden"
                      style={{
                        borderColor: active ? "#FF3DA0" : "rgba(0,0,0,0.10)",
                        background: active ? "#FF3DA010" : "white",
                        boxShadow: active ? "0 4px 20px #FF3DA030" : "0 1px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Active top accent bar */}
                      {active && (
                        <span className="absolute top-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#FF3DA0" }} />
                      )}
                      <div className="font-extrabold text-base text-black"
                        style={{ fontFamily: "var(--font-display)", color: active ? "#FF3DA0" : "black" }}>
                        {size === 0 ? "Individual" : `${size} Cookies`}
                      </div>
                      <div className="text-[10px] text-black/50 font-semibold mt-0.5"
                        style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.06em" }}>
                        {c.label.toUpperCase()}
                      </div>
                      <div className="text-base font-extrabold mt-2" style={{ color: "#FF3DA0", fontFamily: "var(--font-display)" }}>
                        {c.flatPrice ? `$${c.flatPrice}` : "Per cookie"}
                      </div>
                      <div className="text-[10px] text-black/40 font-medium mt-0.5" style={{ fontFamily: "var(--font-oswald)" }}>
                        Up to {c.maxFlavors} flavor{c.maxFlavors !== 1 ? "s" : ""}
                      </div>
                    </button>
                  )
                })}
              </div>
              {!showMore && (
                <button
                  onClick={() => setShowMore(true)}
                  className="text-xs font-semibold text-[#4DAEEA] hover:underline mt-1"
                  style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}
                >
                  Need a bigger batch? See all sizes ↓
                </button>
              )}
            </StepCard>

            {/* Step 2 — Element Picker */}
            <StepCard number={2} label="Select Your Elements">
              {atMax && (
                <div
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                  style={{ background: "#FF3DA010", color: "#FF3DA0", fontFamily: "var(--font-oswald)", letterSpacing: "0.04em" }}
                >
                  Max flavors reached for this batch ({config.maxFlavors}).
                  Deselect one to swap, or pick a larger size above.
                </div>
              )}
              <PeriodicTable
                boxSize={boxSize}
                selectedIds={selectedIds}
                onToggle={toggleCookie}
              />
            </StepCard>

            {/* Step 3 — Instructions */}
            <StepCard number={3} label="Special Instructions">
              <div className="relative">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value.slice(0, MAX_INSTRUCTIONS))}
                  placeholder="Allergies, gift message, occasion notes, packaging requests..."
                  rows={3}
                  className="w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3 text-sm resize-none
                             focus:outline-none focus:border-[#FF3DA0] transition-colors placeholder:text-black/25"
                />
                <span
                  className="absolute bottom-3 right-3 text-[10px]"
                  style={{
                    color: instructions.length > MAX_INSTRUCTIONS * 0.9 ? "#FF3DA0" : "rgba(0,0,0,0.2)",
                    fontFamily: "var(--font-oswald)",
                  }}
                >
                  {instructions.length}/{MAX_INSTRUCTIONS}
                </span>
              </div>
              <p className="text-[11px] text-black/30" style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                OPTIONAL · We read every note before baking.
              </p>
            </StepCard>

            {/* Allergen notice */}
            <AllergenNotice />

            {/* Step 4 — Fulfillment */}
            <StepCard number={4} label="How Should We Deliver?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FULFILLMENT_OPTIONS.map((opt) => {
                  const active = fulfillment === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFulfillment(opt.value)}
                      className="rounded-xl border-2 p-4 text-left transition-all duration-150 hover:-translate-y-0.5"
                      style={{
                        borderColor: active ? "#4DAEEA" : "rgba(0,0,0,0.08)",
                        background: active ? "#4DAEEA10" : "white",
                        boxShadow: active ? "0 2px 12px #4DAEEA20" : undefined,
                      }}
                    >
                      <div className="font-extrabold text-sm text-black"
                        style={{ fontFamily: "var(--font-display)" }}>
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-black/40 mt-0.5"
                        style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                        {opt.sub.toUpperCase()}
                      </div>
                      <div className="text-sm font-bold mt-1.5" style={{ color: "#4DAEEA" }}>
                        {opt.fee}
                      </div>
                    </button>
                  )
                })}
              </div>
            </StepCard>

            {/* Step 5 — Customer Info (animated reveal) */}
            <div
              style={{
                overflow: "hidden",
                maxHeight: fulfillment ? "600px" : "0",
                opacity: fulfillment ? 1 : 0,
                transform: fulfillment ? "translateY(0)" : "translateY(12px)",
                transition: "max-height 0.4s ease, opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <StepCard number={5} label="Your Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-black/40 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-oswald)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jane Smith"
                      autoComplete="name"
                      className="w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3 text-sm
                                 focus:outline-none focus:border-[#FF3DA0] transition-colors placeholder:text-black/25"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-black/40 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-oswald)" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border-2 bg-white px-4 py-3 text-sm
                                 focus:outline-none transition-colors placeholder:text-black/25"
                      style={{
                        borderColor: emailError ? "#EF4444" : "rgba(0,0,0,0.10)",
                        outlineColor: emailError ? "#EF4444" : "#FF3DA0",
                      }}
                    />
                    {emailError && (
                      <p className="text-xs text-red-500">Please enter a valid email address.</p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-black/30" style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                  YOUR EMAIL RECEIVES THE ORDER CONFIRMATION · PAYMENTS SECURED BY STRIPE
                </p>
              </StepCard>
            </div>

          </div>

          {/* ── Sticky summary ─────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <OrderSummary
              boxSize={boxSize}
              selectedCookies={selectedCookies}
              fulfillment={fulfillment}
            />

            {checkoutError && (
              <p className="text-xs text-red-500 text-center font-medium">{checkoutError}</p>
            )}

            <button
              disabled={!canSubmit || loading}
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-200 flex items-center justify-center gap-1"
              style={{
                fontFamily: "var(--font-display)",
                background: canSubmit && !loading ? "#FF3DA0" : "rgba(0,0,0,0.08)",
                color: canSubmit && !loading ? "white" : "rgba(0,0,0,0.3)",
                cursor: canSubmit && !loading ? "pointer" : "not-allowed",
                boxShadow: canSubmit && !loading ? "0 4px 20px #FF3DA040" : undefined,
                transform: canSubmit && !loading ? undefined : undefined,
              }}
            >
              {loading && <Spinner />}
              {loading
                ? "Preparing your batch…"
                : canSubmit
                  ? "Proceed to Checkout →"
                  : "Complete all steps to continue"}
            </button>

            {!canCheckout && selectedIds.length === 0 && (
              <p className="text-center text-xs text-black/30"
                style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                STEP 2 · SELECT AT LEAST ONE ELEMENT
              </p>
            )}
            {selectedIds.length > 0 && !fulfillment && (
              <p className="text-center text-xs text-black/30"
                style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                STEP 4 · CHOOSE A FULFILLMENT METHOD
              </p>
            )}
            {fulfillment && !canSubmit && (
              <p className="text-center text-xs text-black/30"
                style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                STEP 5 · ENTER YOUR DETAILS ABOVE
              </p>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const steps = ["Batch Size", "Elements", "Instructions", "Fulfillment", "Details"]
  return (
    <div className="flex items-center gap-1">
      {steps.map((label, i) => {
        const done   = i + 1 < step
        const active = i + 1 === step
        return (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="h-1 w-full rounded-full transition-all duration-500"
                style={{
                  background: done ? "#FF3DA0" : active ? "#FF3DA060" : "rgba(0,0,0,0.1)",
                }}
              />
              <span
                className="text-[9px] font-semibold hidden sm:block truncate"
                style={{
                  fontFamily: "var(--font-oswald)",
                  letterSpacing: "0.06em",
                  color: done || active ? "#FF3DA0" : "rgba(0,0,0,0.25)",
                }}
              >
                {label.toUpperCase()}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-black/6 bg-white/80 backdrop-blur-sm p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="w-7 h-7 rounded-full bg-[#FF3DA0] text-white text-xs font-extrabold flex items-center justify-center shrink-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {number}
        </span>
        <span
          className="font-extrabold text-sm text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
  boxSize,
  selectedCookies,
  fulfillment,
}: {
  boxSize: number
  selectedCookies: Cookie[]
  fulfillment: FulfillmentType | null
}) {
  const config = BOX_CONFIG[boxSize]

  return (
    <div className="rounded-2xl border-2 border-black/8 bg-white p-5 space-y-4">
      <h3
        className="font-extrabold text-sm text-black"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Your Formula
      </h3>

      <div className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-black/30"
          style={{ fontFamily: "var(--font-oswald)" }}>
          Batch
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-black" style={{ fontFamily: "var(--font-display)" }}>
            {boxSize === 0 ? "Individual" : `${boxSize}`}
          </span>
          {boxSize !== 0 && <span className="text-sm text-black/40">cookies</span>}
        </div>
        <p className="text-[10px] text-black/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
          {config.label} · Up to {config.maxFlavors} flavors
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-black/30"
          style={{ fontFamily: "var(--font-oswald)" }}>
          Elements Selected
        </span>
        {selectedCookies.length === 0 ? (
          <p className="text-xs text-black/25 italic">None yet — pick from the table</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedCookies.map((c) => {
              const colors = GROUP_COLORS[c.group]
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${colors.bg} ${colors.border}`}
                >
                  <span
                    className={`text-sm font-extrabold leading-none ${colors.text}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.symbol}
                  </span>
                  <span className="text-[10px] text-black/50 leading-none">{c.name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {fulfillment && (
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-black/30"
            style={{ fontFamily: "var(--font-oswald)" }}>
            Fulfillment
          </span>
          <p className="text-sm font-bold text-[#4DAEEA]" style={{ fontFamily: "var(--font-display)" }}>
            {FULFILLMENT_OPTIONS.find((o) => o.value === fulfillment)?.label}
          </p>
        </div>
      )}

      <div className="border-t border-black/8 pt-3 flex items-baseline justify-between">
        <span className="text-xs text-black/40">Estimated Total</span>
        <span
          className="text-2xl font-extrabold text-[#FF3DA0]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {config.flatPrice ? `$${config.flatPrice}` : "TBD at checkout"}
        </span>
      </div>
    </div>
  )
}
