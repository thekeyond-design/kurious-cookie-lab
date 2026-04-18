"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useCart } from "@/components/cart/CartContext"
import { COOKIES } from "@/lib/cookies"
import { BOX_CONFIG } from "@/types"
import type { FulfillmentType } from "@/types"

const NC_TAX_RATE = 0.0675

const FULFILLMENT_OPTIONS = [
  { value: "pickup" as FulfillmentType,         label: "Pickup",         sub: "Guilford County, NC", fee: 0 },
  { value: "local_delivery" as FulfillmentType, label: "Local Delivery", sub: "Guilford County area", fee: 5 },
  { value: "nc_shipping" as FulfillmentType,    label: "NC Shipping",    sub: "North Carolina",       fee: 8 },
]

export default function CheckoutPage() {
  const { items, cartSubtotal, clearCart } = useCart()
  const router = useRouter()

  const [fulfillment, setFulfillment] = useState<FulfillmentType | null>(null)
  const [name, setName]               = useState("")
  const [email, setEmail]             = useState("")
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) router.replace("/order")
  }, [items, router])

  const shippingFee   = FULFILLMENT_OPTIONS.find(o => o.value === fulfillment)?.fee ?? 0
  const tax           = Math.round(cartSubtotal * NC_TAX_RATE * 100) / 100
  const total         = cartSubtotal + shippingFee + tax

  const canSubmit = fulfillment && name.trim() && email.trim() && items.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ boxSize: i.boxSize, cookieIds: i.cookieIds })),
          fulfillment,
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          instructions: instructions.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return }
      clearCart()
      window.location.href = data.url
    } catch {
      setError("Network error — please try again.")
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FAF6F0" }}>

        {/* Header */}
        <div className="relative overflow-hidden py-14 px-4" style={{ background: "#1a1a4e" }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(77,174,234,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(77,174,234,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4DAEEA]" style={{ fontFamily: "var(--font-oswald)" }}>
              Final Step
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>
              Complete Your Order
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              {/* Left — form */}
              <div className="space-y-6">

                {/* Fulfillment */}
                <div className="bg-white rounded-2xl border-2 border-black/5 p-5 space-y-4">
                  <h2 className="font-extrabold text-sm text-black" style={{ fontFamily: "var(--font-display)" }}>
                    Fulfillment Method
                  </h2>
                  <div className="space-y-2.5">
                    {FULFILLMENT_OPTIONS.map((opt) => {
                      const active = fulfillment === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFulfillment(opt.value)}
                          className="w-full flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all"
                          style={{
                            borderColor: active ? "#FF3DA0" : "rgba(0,0,0,0.08)",
                            background: active ? "#FF3DA008" : "white",
                          }}
                        >
                          <div>
                            <p className="text-sm font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>{opt.label}</p>
                            <p className="text-xs text-black/40 mt-0.5">{opt.sub}</p>
                          </div>
                          <span className="text-sm font-extrabold" style={{ fontFamily: "var(--font-display)", color: active ? "#FF3DA0" : "rgba(0,0,0,0.35)" }}>
                            {opt.fee === 0 ? "Free" : `$${opt.fee.toFixed(2)}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-white rounded-2xl border-2 border-black/5 p-5 space-y-4">
                  <h2 className="font-extrabold text-sm text-black" style={{ fontFamily: "var(--font-display)" }}>
                    Your Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-[#FF3DA0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-[#FF3DA0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>Special Instructions <span className="text-black/25 normal-case">(optional)</span></label>
                      <textarea
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Allergies, gift notes, pickup time preferences..."
                        className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#FF3DA0] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</p>
                )}
              </div>

              {/* Right — order summary */}
              <div className="bg-white rounded-2xl border-2 border-black/5 p-5 space-y-4 lg:sticky lg:top-24">
                <h2 className="font-extrabold text-sm text-black" style={{ fontFamily: "var(--font-display)" }}>
                  Order Summary
                </h2>

                <div className="space-y-2">
                  {items.map((item) => {
                    const config = BOX_CONFIG[item.boxSize]
                    const cookies = item.cookieIds.map(id => COOKIES.find(c => c.id === id)).filter(Boolean)
                    return (
                      <div key={item.id} className="flex items-start justify-between gap-2 py-2 border-b border-black/5 last:border-0">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>{config?.label}</p>
                          <p className="text-[10px] text-black/35 truncate">{cookies.map(c => c?.symbol).join(" · ")}</p>
                        </div>
                        <span className="text-xs font-bold text-black/60 shrink-0">${item.subtotal.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-1.5 border-t border-black/8 pt-3">
                  <div className="flex justify-between text-xs text-black/45">
                    <span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-black/45">
                    <span>Fulfillment</span>
                    <span>{fulfillment ? (shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-black/45">
                    <span>NC Sales Tax (6.75%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-black/8 pt-3 flex justify-between items-baseline">
                  <span className="text-xs text-black/40">Total</span>
                  <span className="text-2xl font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="w-full rounded-xl bg-[#FF3DA0] text-white font-extrabold text-sm py-4 hover:bg-[#e8007f] active:scale-95 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {loading ? "Redirecting..." : "Pay Now →"}
                </button>

                <Link
                  href="/cart"
                  className="flex items-center justify-center text-xs text-black/35 hover:text-black/60 transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
