"use client"

import Link from "next/link"
import { X, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "./CartContext"
import { COOKIES } from "@/lib/cookies"
import { BOX_CONFIG } from "@/types"

const NC_TAX_RATE = 0.0675

function CartLineItem({ item, onRemove }: { item: import("./CartContext").CartItem; onRemove: () => void }) {
  const config = BOX_CONFIG[item.boxSize]
  const cookies = item.cookieIds.map(id => COOKIES.find(c => c.id === id)).filter(Boolean)

  return (
    <div className="flex items-start gap-3 py-4 border-b border-black/6 last:border-0">
      {/* Element badge */}
      <div
        className="shrink-0 w-10 h-10 rounded-xl border-2 border-[#FF3DA0]/40 bg-[#FF3DA0]/8 flex items-center justify-center"
      >
        <span className="text-xs font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
          {item.boxSize === 0 ? "Ind" : item.boxSize}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {config?.label ?? "Custom Batch"}
        </p>
        <p className="text-[11px] text-black/45 mt-0.5 truncate">
          {cookies.map(c => c?.symbol).join(" · ")}
        </p>
        <p className="text-xs text-black/35 mt-0.5 truncate">
          {cookies.map(c => c?.name).join(", ")}
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2">
        <span className="text-sm font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
          ${item.subtotal.toFixed(2)}
        </span>
        <button
          onClick={onRemove}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-black/25 hover:text-red-400 hover:bg-red-50 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, cartSubtotal, itemCount } = useCart()
  const tax = Math.round(cartSubtotal * NC_TAX_RATE * 100) / 100

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8" style={{ background: "#1a1a4e" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-white/60" />
            <span className="text-sm font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Your Cart
            </span>
            {itemCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF3DA0] text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-black/15 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-black/20" />
              </div>
              <div>
                <p className="text-sm font-bold text-black/40" style={{ fontFamily: "var(--font-display)" }}>
                  Your cart is empty
                </p>
                <p className="text-xs text-black/25 mt-1">Add a batch to get started</p>
              </div>
              <Link
                href="/order"
                onClick={closeCart}
                className="rounded-xl bg-[#FF3DA0] text-white text-sm font-bold px-6 py-2.5 hover:bg-[#e8007f] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Build a Batch →
              </Link>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <CartLineItem key={item.id} item={item} onRemove={() => removeItem(item.id)} />
              ))}
              <Link
                href="/order"
                onClick={closeCart}
                className="flex items-center justify-center gap-1.5 w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-[#FF3DA0]/30 text-[#FF3DA0] text-xs font-bold hover:border-[#FF3DA0]/60 transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                + Add Another Batch
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-black/8 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-black/45">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-black/45">
                <span>NC Sales Tax (6.75%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-black pt-1 border-t border-black/8">
                <span style={{ fontFamily: "var(--font-display)" }}>Estimated Total</span>
                <span className="text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
                  ${(cartSubtotal + tax).toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-black/30 text-center">+ fulfillment added at checkout</p>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center w-full rounded-xl bg-[#FF3DA0] text-white font-extrabold text-sm py-4 hover:bg-[#e8007f] active:scale-95 transition-all shadow-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Go to Checkout →
            </Link>

            <Link
              href="/cart"
              onClick={closeCart}
              className="flex items-center justify-center w-full rounded-xl border-2 border-black/10 text-black/55 font-bold text-xs py-2.5 hover:border-black/20 transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
