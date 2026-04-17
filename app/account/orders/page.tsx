import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/account/SignOutButton"

export const metadata = {
  title: "My Orders | Kurious Cookie Lab",
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#FF9F4315", color: "#FF9F43", label: "Pending" },
  confirmed:  { bg: "#4DAEEA15", color: "#4DAEEA", label: "Confirmed" },
  baking:     { bg: "#FF3DA015", color: "#FF3DA0", label: "In the Lab" },
  ready:      { bg: "#3EC9C915", color: "#3EC9C9", label: "Ready" },
  fulfilled:  { bg: "#3EC9C915", color: "#3EC9C9", label: "Fulfilled" },
  cancelled:  { bg: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.35)", label: "Cancelled" },
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/account")

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", user.email!)
    .order("created_at", { ascending: false })

  const displayName = user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Scientist"

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FAF6F0" }}>

        {/* Page header */}
        <div className="relative overflow-hidden py-16 px-4" style={{ background: "#1a1a4e" }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(77,174,234,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(77,174,234,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4DAEEA]" style={{ fontFamily: "var(--font-oswald)" }}>
                Lab Notebook
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back, {displayName}
              </h1>
              <p className="text-white/40 text-sm mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/order"
                className="rounded-xl bg-[#FF3DA0] text-white text-sm font-bold px-5 py-2.5 hover:bg-[#e8007f] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              >
                New Order →
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          {!orders || orders.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#FF3DA0]/30 mx-auto flex items-center justify-center"
              >
                <span className="text-2xl font-extrabold text-[#FF3DA0]/30" style={{ fontFamily: "var(--font-display)" }}>0</span>
              </div>
              <p className="text-black/40 text-sm">No orders yet — your lab notebook is empty.</p>
              <Link
                href="/order"
                className="inline-block rounded-xl bg-[#FF3DA0] text-white text-sm font-bold px-6 py-3 hover:bg-[#e8007f] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Start Your First Batch →
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const status = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending
              const date = new Date(order.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white rounded-2xl border-2 border-black/5 p-5 hover:border-[#FF3DA0]/20 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-black" style={{ fontFamily: "var(--font-display)" }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ fontFamily: "var(--font-oswald)", background: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-black/40">{date} · {order.box_size ?? "—"} · {order.fulfillment ?? "—"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-extrabold text-[#FF3DA0]" style={{ fontFamily: "var(--font-display)" }}>
                        ${Number(order.total ?? 0).toFixed(2)}
                      </p>
                      <span className="text-xs text-black/30 group-hover:text-[#FF3DA0] transition-colors">View →</span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
