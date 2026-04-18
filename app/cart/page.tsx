"use client"

import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useCart } from "@/components/cart/CartContext"
import { COOKIES } from "@/lib/cookies"
import { BOX_CONFIG } from "@/types"

const NC_TAX_RATE = 0.0675

export default function CartPage() {
  const { items, removeItem, clearCart, cartSubtotal } = useCart()
  const tax = Math.round(cartSubtotal * NC_TAX_RATE * 100) / 100
  const estimatedTotal = cartSubtotal + tax

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
              Your Formula
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>
              Cart
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-5">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#FF3DA0]/30 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#FF3DA0]/30" />
              </div>
              <p className="text-black/40 text-sm">Your cart is empty.</p>
              <Link
                href="/order"
                className="inline-block rounded-xl bg-[#FF3DA0] text-white text-sm font-bold px-8 py-3 hover:bg-[#e8007f] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Build a Batch →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

              {/* Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-black/50 uppercase tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
                    {items.length} {items.length === 1 ? "Batch" : "Batches"}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-black/30 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {items.map((item) => {
                  const config = BOX_CONFIG[item.boxSize]
                  const cookies = item.cookieIds.map(id => COOKIES.find(c => c.id === id)).filter(Boolean)

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border-2 border-black/5 p-5 flex items-start gap-4"
                    >
                      {/* Badge */}
                      <div className="shrink-0 w-14 h-14 rounded-xl border-2 border-[#FF3DA0]/30 bg-[#FF3DA0]/6 flex flex-col items-center justify-center gap-0.5">
                        <span className="text-[9px] font-mono text-[#FF3DA0]/50 leading-none">
                          {item.boxSize === 0 ? "ind" : "box"}
                        </span>
                        <span className="text-xl font-extrabold text-[#FF3DA0] leading-none" style={{ fontFamily: "var(--font-display)" }}>
                          {item.boxSize === 0 ? "1" : item.boxSize}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-base text-black" style={{ fontFamily: "var(--font-display)" }}>
                          {config?.label ?? "Custom Batch"}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cookies.map((c) => (
                            <span
                              key={c!.id}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FF3DA0]/8 text-[#FF3DA0] border border-[#FF3DA0]/20"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {c!.symbol} · {c!.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-3">
                        <span className="text-lg font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-[11px] text-black/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}

                <Link
                  href="/order"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-[#FF3DA0]/25 text-[#FF3DA0] text-sm font-bold hover:border-[#FF3DA0]/50 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  + Add Another Batch
                </Link>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl border-2 border-black/5 p-5 space-y-4 lg:sticky lg:top-24">
                <h2 className="font-extrabold text-sm text-black" style={{ fontFamily: "var(--font-display)" }}>
                  Order Summary
                </h2>

                <div className="space-y-2">
                  {items.map((item) => {
                    const config = BOX_CONFIG[item.boxSize]
                    return (
                      <div key={item.id} className="flex justify-between text-xs text-black/50">
                        <span>{config?.label ?? "Batch"}</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-black/8 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-black/45">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-black/45">
                    <span>NC Sales Tax (6.75%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-black/30 italic">
                    <span>Fulfillment</span>
                    <span>at checkout</span>
                  </div>
                </div>

                <div className="border-t border-black/8 pt-3 flex justify-between items-baseline">
                  <span className="text-xs text-black/40">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center w-full rounded-xl bg-[#FF3DA0] text-white font-extrabold text-sm py-4 hover:bg-[#e8007f] active:scale-95 transition-all shadow-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Go to Checkout →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
