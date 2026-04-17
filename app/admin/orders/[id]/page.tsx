import Link from "next/link"
import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/server"
import { StatusUpdater } from "./StatusUpdater"
import type { OrderStatus } from "@/types/database"

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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()

  if (!order) notFound()

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(name, symbol, atomic_number)")
    .eq("order_id", id)

  const colors = STATUS_COLORS[order.status as OrderStatus]

  return (
    <div className="min-h-screen" style={{ background: "#FAF6F0" }}>
      {/* Header */}
      <div className="border-b border-black/8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-black/40 hover:text-black transition-colors text-sm">
              ← Orders
            </Link>
            <span className="text-black/20">/</span>
            <span className="text-sm font-mono text-black/50">{order.id.slice(0, 8)}…</span>
          </div>
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-bold border"
            style={{ background: colors.bg, color: colors.text, borderColor: colors.border, fontFamily: "var(--font-oswald)" }}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Customer + order meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-black/6 p-6 space-y-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider text-black/40"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Customer
            </h2>
            <div>
              <p className="font-extrabold text-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
                {order.customer_name}
              </p>
              <a
                href={`mailto:${order.customer_email}`}
                className="text-sm text-[#4DAEEA] hover:underline"
              >
                {order.customer_email}
              </a>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-0.5" style={{ fontFamily: "var(--font-oswald)" }}>
                Fulfillment
              </p>
              <p className="text-sm font-semibold text-black">
                {FULFILLMENT_LABELS[order.fulfillment] ?? order.fulfillment}
              </p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-0.5" style={{ fontFamily: "var(--font-oswald)" }}>
                Ordered
              </p>
              <p className="text-sm text-black/70">
                {new Date(order.created_at).toLocaleString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-black/6 p-6 space-y-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider text-black/40"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Box Size</span>
                <span className="font-semibold text-black">
                  {order.box_size === 0 ? "Individual" : `${order.box_size}-pack`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Subtotal</span>
                <span className="font-semibold text-black">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/55">Shipping / Fulfillment</span>
                <span className="font-semibold text-black">${order.shipping_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-black/8 pt-2 mt-2">
                <span className="font-bold text-black">Total</span>
                <span
                  className="font-extrabold text-[#FF3DA0] text-base"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {order.stripe_payment_intent_id && (
              <p className="text-xs text-black/30 font-mono break-all pt-2">
                PI: {order.stripe_payment_intent_id}
              </p>
            )}
          </div>
        </div>

        {/* Special instructions */}
        {order.special_instructions && (
          <div className="rounded-2xl bg-white border border-[#FF3DA0]/15 p-6">
            <p
              className="text-xs font-bold uppercase tracking-wider text-[#FF3DA0]/70 mb-2"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Special Instructions
            </p>
            <p className="text-sm text-black/70 leading-relaxed">{order.special_instructions}</p>
          </div>
        )}

        {/* Order items */}
        <div className="rounded-2xl bg-white border border-black/6 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6">
            <h2
              className="text-xs font-bold uppercase tracking-wider text-black/40"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Cookie Formula ({items?.length ?? 0} flavor{items?.length !== 1 ? "s" : ""})
            </h2>
          </div>
          <div className="divide-y divide-black/4">
            {items?.map((item) => {
              const product = item.products as { name: string; symbol: string; atomic_number: number } | null
              return (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-[#FF3DA0]/30 bg-[#FF3DA0]/5
                                 flex flex-col items-center justify-center shrink-0"
                    >
                      <span className="text-[8px] font-mono text-[#FF3DA0]/50 self-start ml-1 leading-none">
                        {product?.atomic_number}
                      </span>
                      <span
                        className="text-sm font-extrabold text-[#FF3DA0] leading-none"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {product?.symbol ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm">{product?.name ?? "Unknown"}</p>
                      <p className="text-xs text-black/40">qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-black text-sm">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status updater */}
        <StatusUpdater orderId={order.id} currentStatus={order.status as OrderStatus} />
      </div>
    </div>
  )
}
