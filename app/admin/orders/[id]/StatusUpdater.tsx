"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { OrderStatus } from "@/types/database"

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "baking",
  "ready",
  "out_for_delivery",
  "completed",
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  baking:           "Baking",
  ready:            "Ready for Pickup / Ship",
  out_for_delivery: "Out for Delivery",
  completed:        "Completed",
  cancelled:        "Cancelled",
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending:          { bg: "#FFF8E7", text: "#D97706", border: "#FCD34D" },
  confirmed:        { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" },
  baking:           { bg: "#FFF0F9", text: "#FF3DA0", border: "#FBCFE8" },
  ready:            { bg: "#F0FDF4", text: "#16A34A", border: "#86EFAC" },
  out_for_delivery: { bg: "#F0F9FF", text: "#0284C7", border: "#7DD3FC" },
  completed:        { bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB" },
  cancelled:        { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" },
}

export function StatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleUpdate() {
    if (selected === currentStatus) return
    setLoading(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update.")
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-black/6 p-6 space-y-5">
      <h2
        className="text-xs font-bold uppercase tracking-wider text-black/40"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        Update Status
      </h2>

      {/* Status flow pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FLOW.map((s) => {
          const isActive = selected === s
          const colors = STATUS_COLORS[s]
          return (
            <button
              key={s}
              onClick={() => { setSelected(s); setSaved(false) }}
              className="rounded-full px-4 py-1.5 text-xs font-bold border transition-all"
              style={{
                background: isActive ? colors.bg : "transparent",
                color: isActive ? colors.text : "#9CA3AF",
                borderColor: isActive ? colors.border : "#E5E7EB",
                fontFamily: "var(--font-oswald)",
              }}
            >
              {STATUS_LABELS[s]}
            </button>
          )
        })}
        <button
          onClick={() => { setSelected("cancelled"); setSaved(false) }}
          className="rounded-full px-4 py-1.5 text-xs font-bold border transition-all"
          style={{
            background: selected === "cancelled" ? STATUS_COLORS.cancelled.bg : "transparent",
            color: selected === "cancelled" ? STATUS_COLORS.cancelled.text : "#9CA3AF",
            borderColor: selected === "cancelled" ? STATUS_COLORS.cancelled.border : "#E5E7EB",
            fontFamily: "var(--font-oswald)",
          }}
        >
          Cancel Order
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleUpdate}
          disabled={loading || selected === currentStatus}
          className="rounded-xl bg-[#FF3DA0] text-white text-sm font-extrabold px-6 py-2.5
                     hover:bg-[#FF66C4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {loading ? "Saving…" : "Save Status"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-semibold">Saved!</span>
        )}
        {selected !== currentStatus && !saved && (
          <span className="text-xs text-black/40">
            {STATUS_LABELS[currentStatus]} → {STATUS_LABELS[selected]}
          </span>
        )}
      </div>
    </div>
  )
}
