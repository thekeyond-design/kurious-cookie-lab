"use client"

import { Cookie } from "@/types"
import { GROUP_COLORS } from "@/lib/cookies"

interface ElementTileProps {
  cookie: Cookie
  selected?: boolean
  disabled?: boolean
  quantity?: number
  onClick?: () => void
}

export function ElementTile({
  cookie,
  selected = false,
  disabled = false,
  quantity = 0,
  onClick,
}: ElementTileProps) {
  const colors = GROUP_COLORS[cookie.group]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "element-tile",
        "w-full aspect-square flex flex-col items-center justify-center gap-0.5",
        "relative text-center transition-all duration-150",
        colors.bg,
        colors.border,
        colors.text,
        selected ? "selected" : "",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        cookie.isUnstable ? "unstable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      title={cookie.name}
    >
      {/* Atomic number */}
      <span className="absolute top-1.5 left-2 text-[10px] font-mono opacity-70 leading-none">
        {cookie.atomicNumber}
      </span>

      {/* Unstable badge */}
      {cookie.isUnstable && (
        <span className="absolute top-1 right-1.5 text-[8px] font-bold uppercase tracking-wide opacity-80 leading-none">
          ⚠
        </span>
      )}

      {/* Symbol */}
      <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight">
        {cookie.symbol}
      </span>

      {/* Full name */}
      <span className="text-[9px] sm:text-[10px] font-semibold leading-tight px-1 opacity-90 line-clamp-2">
        {cookie.name}
      </span>

      {/* Selected quantity badge */}
      {selected && quantity > 0 && (
        <span
          className={[
            "absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black",
            "flex items-center justify-center text-white shadow-md",
            "bg-[#FF3DA0]",
          ].join(" ")}
        >
          {quantity}
        </span>
      )}
    </button>
  )
}
