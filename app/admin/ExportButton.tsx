"use client"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  box_size: number
  cookie_ids: string[]
  fulfillment: string
  total: number
  status: string
  special_instructions: string | null
  created_at: string
}

const FULFILLMENT_LABELS: Record<string, string> = {
  pickup:            "Pickup",
  local_delivery:    "Local Delivery",
  nc_shipping:       "NC Shipping",
  national_shipping: "National Shipping",
}

export function ExportButton({ orders }: { orders: Order[] }) {
  function handleExport() {
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Box Size",
      "Flavors",
      "Fulfillment",
      "Total",
      "Status",
      "Special Instructions",
    ]

    const rows = orders.map((o) => [
      o.id,
      new Date(o.created_at).toLocaleDateString("en-US"),
      o.customer_name,
      o.customer_email,
      o.box_size === 0 ? "Individual" : `${o.box_size}-pack`,
      (o.cookie_ids ?? []).join(", "),
      FULFILLMENT_LABELS[o.fulfillment] ?? o.fulfillment,
      `$${o.total.toFixed(2)}`,
      o.status.replace(/_/g, " "),
      o.special_instructions ?? "",
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kcl-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-xl border-2 border-black/10 bg-white px-4 py-2 text-xs font-bold
                 hover:border-[#FF3DA0] hover:text-[#FF3DA0] transition-all"
      style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.06em" }}
    >
      ↓ Export CSV
    </button>
  )
}
