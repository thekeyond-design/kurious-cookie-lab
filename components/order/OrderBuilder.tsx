"use client"

import { useState } from "react"
import { Cookie, BOX_CONFIG, OrderDraft } from "@/types"
import { PeriodicTable } from "@/components/lab/PeriodicTable"

const FEATURED_SIZES = [0, 6, 12]
const ALL_SIZES = [0, 6, 12, 20, 26, 32]

export function OrderBuilder() {
  const [boxSize, setBoxSize] = useState<number>(6)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showMore, setShowMore] = useState(false)
  const [instructions, setInstructions] = useState("")

  const visibleSizes = showMore ? ALL_SIZES : FEATURED_SIZES
  const config = BOX_CONFIG[boxSize]

  function toggleCookie(cookie: Cookie) {
    setSelectedIds((prev) => {
      if (prev.includes(cookie.id)) {
        return prev.filter((id) => id !== cookie.id)
      }
      if (prev.length >= config.maxFlavors) return prev
      return [...prev, cookie.id]
    })
  }

  function handleSizeChange(size: number) {
    setBoxSize(size)
    // Reset selections if new max flavors is smaller
    const newMax = BOX_CONFIG[size].maxFlavors
    setSelectedIds((prev) => prev.slice(0, newMax))
  }

  const canProceed = selectedIds.length >= 1 && (boxSize === 0 ? true : true)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Build Your Formula
        </h1>
        <p className="text-sm text-black/50 font-medium">
          Choose your batch size, then select your elements.
        </p>
      </div>

      {/* Step 1: Box Size */}
      <section className="space-y-3">
        <StepLabel number={1} label="Choose your batch size" />
        <div className="flex flex-wrap gap-3">
          {visibleSizes.map((size) => {
            const c = BOX_CONFIG[size]
            const isActive = boxSize === size
            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={[
                  "flex-1 min-w-[120px] rounded-2xl border-2 px-4 py-3 text-left transition-all duration-150",
                  isActive
                    ? "border-[#FF3DA0] bg-[#FF3DA0]/10 shadow-md"
                    : "border-black/10 bg-white hover:border-[#4DAEEA] hover:bg-[#4DAEEA]/5",
                ].join(" ")}
              >
                <div className="font-black text-sm text-black">
                  {size === 0 ? "Individual" : `${size} Cookies`}
                </div>
                <div className="text-xs text-black/50 font-medium mt-0.5">
                  {c.label}
                </div>
                <div className="text-xs font-bold mt-1 text-[#FF3DA0]">
                  {c.flatPrice ? `$${c.flatPrice}` : "Per cookie"}
                </div>
                <div className="text-[10px] text-black/40 mt-0.5">
                  Up to {c.maxFlavors} flavor{c.maxFlavors !== 1 ? "s" : ""}
                </div>
              </button>
            )
          })}
        </div>

        {!showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="text-xs text-[#4DAEEA] font-semibold hover:underline"
          >
            Need more? See larger batches ↓
          </button>
        )}
      </section>

      {/* Step 2: Pick Flavors */}
      <section className="space-y-3">
        <StepLabel number={2} label="Select your elements" />
        <PeriodicTable
          boxSize={boxSize}
          selectedIds={selectedIds}
          onToggle={toggleCookie}
        />
      </section>

      {/* Step 3: Special Instructions */}
      <section className="space-y-3">
        <StepLabel number={3} label="Special instructions (optional)" />
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Allergies, decorations, occasion notes..."
          rows={3}
          className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm resize-none
                     focus:outline-none focus:border-[#FF3DA0] transition-colors"
        />
      </section>

      {/* Live Total */}
      <OrderSummary boxSize={boxSize} selectedIds={selectedIds} />

      {/* CTA */}
      <button
        disabled={!canProceed || selectedIds.length === 0}
        className={[
          "w-full py-4 rounded-2xl font-black text-lg tracking-tight transition-all duration-150",
          canProceed && selectedIds.length > 0
            ? "bg-[#FF3DA0] text-white hover:bg-[#FF66C4] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            : "bg-black/10 text-black/30 cursor-not-allowed",
        ].join(" ")}
      >
        Synthesize My Batch →
      </button>
    </div>
  )
}

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[#FF3DA0] text-white text-xs font-black flex items-center justify-center shrink-0">
        {number}
      </span>
      <span className="font-bold text-sm text-black">{label}</span>
    </div>
  )
}

function OrderSummary({ boxSize, selectedIds }: { boxSize: number; selectedIds: string[] }) {
  const config = BOX_CONFIG[boxSize]
  if (selectedIds.length === 0) return null

  return (
    <div className="rounded-2xl border-2 border-black/10 bg-[#FAFAFA] px-5 py-4 space-y-1">
      <p className="font-black text-sm text-black">Your Formula</p>
      <div className="flex justify-between text-sm">
        <span className="text-black/60">
          {config.label} · {selectedIds.length} flavor{selectedIds.length !== 1 ? "s" : ""}
        </span>
        <span className="font-bold text-[#FF3DA0]">
          {config.flatPrice ? `$${config.flatPrice}` : "Priced at checkout"}
        </span>
      </div>
      <p className="text-[10px] text-black/40">+ fulfillment added at next step</p>
    </div>
  )
}
