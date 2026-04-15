"use client"

import { useState } from "react"
import { Cookie, BOX_CONFIG } from "@/types"
import { COOKIES } from "@/lib/cookies"
import { ElementTile } from "./ElementTile"

interface PeriodicTableProps {
  boxSize: number
  selectedIds: string[]
  onToggle: (cookie: Cookie) => void
}

export function PeriodicTable({ boxSize, selectedIds, onToggle }: PeriodicTableProps) {
  const config = BOX_CONFIG[boxSize]
  const maxFlavors = config?.maxFlavors ?? 2
  const activeCookies = COOKIES.filter((c) => c.isActive)

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs font-semibold">
        <LegendDot color="border-[#4DAEEA] text-[#4DAEEA]" label="Classic" />
        <LegendDot color="border-[#FF9F43] text-[#FF9F43]" label="Seasonal" />
        <LegendDot color="border-[#FF3DA0] text-[#FF3DA0]" label="Special" />
        <LegendDot color="border-[#3EC9C9] text-[#3EC9C9]" label="Limited" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {activeCookies.map((cookie) => {
          const isSelected = selectedIds.includes(cookie.id)
          const atMax = selectedIds.length >= maxFlavors && !isSelected

          return (
            <ElementTile
              key={cookie.id}
              cookie={cookie}
              selected={isSelected}
              disabled={atMax}
              quantity={isSelected ? 1 : 0}
              onClick={() => !atMax && onToggle(cookie)}
            />
          )
        })}
      </div>

      {/* Flavor limit hint */}
      <p className="mt-3 text-xs text-center text-black/40 font-medium">
        Select up to {maxFlavors} flavor{maxFlavors !== 1 ? "s" : ""} ·{" "}
        {selectedIds.length} / {maxFlavors} chosen
      </p>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className={`flex items-center gap-1.5 ${color}`}>
      <span className={`w-3 h-3 rounded-sm border-2 inline-block ${color}`} />
      {label}
    </span>
  )
}
