import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/types/database"
import { ExportButton } from "./ExportButton"

export const metadata = { title: "Admin | Kurious Cookie Lab" }

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  pending:          { bg: "#FFF8E7", text: "#D97706", border: "#FCD34D" },
  confirmed:        { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" },
  baking:           { bg: "#FFF0F9", text: "#FF3DA0", border: "#FBCFE8" },
  ready:            { bg: "#F0FDF4", text: "#16A34A", border: "#86EFAC" },
  out_for_delivery: { bg: "#F0F9FF", text: "#0284C7", border: "#7DD3FC" },
  completed:        { bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB" },
  cancelled:        { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" },
}

const FULFILLMENT_LABELS: Record<string, string> = {
  pickup:            "Pickup",
  local_delivery:    "Local Delivery",
  nc_shipping:       "NC Shipping",
  national_shipping: "National Shipping",
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  try {
  const { status } = await searchParams
  const supabase = createServiceClient()

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status as OrderStatus)
  }

  const { data: orders, error } = await query

  const { data: counts } = await supabase
    .from("orders")
    .select("status")

  const statusCounts = (counts ?? []).reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen" style={{ background: "#FAF6F0" }}>
      {/* Header */}
      <div className="border-b border-black/8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-black/40 hover:text-black transition-colors text-sm">
              ← Site
            </Link>
            <span className="text-black/20">/</span>
            <span
              className="text-base font-extrabold text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              KCL Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-black/40 font-mono">Orders Dashboard</span>
            <ExportButton orders={orders ?? []} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: counts?.length ?? 0 },
            { label: "Pending", value: statusCounts["pending"] ?? 0, color: "#D97706" },
            { label: "Baking / Ready", value: (statusCounts["baking"] ?? 0) + (statusCounts["ready"] ?? 0), color: "#FF3DA0" },
            { label: "Completed", value: statusCounts["completed"] ?? 0, color: "#16A34A" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-black/6 p-5">
              <p className="text-xs text-black/40 mb-1" style={{ fontFamily: "var(--font-oswald)" }}>
                {stat.label}
              </p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: stat.color ?? "#000", fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "baking", "ready", "out_for_delivery", "completed", "cancelled"].map((s) => {
            const active = (status ?? "all") === s
            const color = s !== "all" ? STATUS_COLORS[s as OrderStatus] : null
            return (
              <Link
                key={s}
                href={s === "all" ? "/admin" : `/admin?status=${s}`}
                className="rounded-full px-4 py-1.5 text-xs font-semibold border transition-all"
                style={{
                  background: active ? (color?.bg ?? "#FF3DA0") : "white",
                  color: active ? (color?.text ?? "white") : "#666",
                  borderColor: active ? (color?.border ?? "#FF3DA0") : "#e5e7eb",
                  fontFamily: "var(--font-oswald)",
                }}
              >
                {s === "all" ? "All Orders" : s.replace(/_/g, " ")}
                {s !== "all" && statusCounts[s] ? ` (${statusCounts[s]})` : ""}
              </Link>
            )
          })}
        </div>

        {/* Orders table */}
        {error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600 text-sm">
            Failed to load orders: {error.message}
          </div>
        ) : !orders?.length ? (
          <div className="rounded-2xl bg-white border border-black/6 p-16 text-center">
            <p className="text-black/30 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-black/6 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-black/[0.02]">
                  {["Customer", "Fulfillment", "Box", "Total", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-black/40"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const colors = STATUS_COLORS[order.status as OrderStatus]
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-black/4 hover:bg-black/[0.015] transition-colors ${i === orders.length - 1 ? "border-0" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-black">{order.customer_name}</p>
                        <p className="text-xs text-black/40">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-black/60">
                        {FULFILLMENT_LABELS[order.fulfillment] ?? order.fulfillment}
                      </td>
                      <td className="px-4 py-3 text-black/60">
                        {order.box_size === 0 ? "Individual" : `${order.box_size}-pack`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-black">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block rounded-full px-3 py-1 text-[11px] font-bold border"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                            fontFamily: "var(--font-oswald)",
                          }}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-black/40 text-xs whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#FF3DA0] text-xs font-semibold hover:underline whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <div className="rounded-2xl bg-red-50 border border-red-200 p-8 max-w-lg text-center space-y-3">
          <p className="font-bold text-red-600">Admin Error</p>
          <p className="text-sm text-red-500 font-mono break-all">
            {err instanceof Error ? err.message : String(err)}
          </p>
        </div>
      </div>
    )
  }
}
