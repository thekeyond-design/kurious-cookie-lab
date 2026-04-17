import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { stripe } from "@/lib/stripe"

export const metadata = {
  title: "Order Confirmed | Kurious Cookie Lab",
}

// Periodic element symbols that float down as confetti
const CONFETTI_SYMBOLS = ["Cc", "PbO", "Dc", "Sn", "Rb", "Vm", "Sw", "Lm", "Cq", "Ts", "Fx", "Hm"]

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  let customerName = "Scientist"
  let customerEmail = ""

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerName = session.metadata?.customer_name ?? "Scientist"
      customerEmail = session.customer_email ?? ""
    } catch {
      // Session not found — still show success page
    }
  }

  return (
    <>
      <style>{`
        @keyframes floatDown {
          0%   { transform: translateY(-80px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          animation: floatDown linear infinite;
          position: fixed;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes popIn {
          0%   { transform: scale(0.5) rotate(-8deg); opacity: 0; }
          70%  { transform: scale(1.08) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        .pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      <Navbar />

      {/* Floating element confetti */}
      {CONFETTI_SYMBOLS.map((sym, i) => (
        <div
          key={sym}
          className="confetti-piece"
          style={{
            left: `${(i * 8.3 + 2) % 96}%`,
            animationDuration: `${6 + (i % 5) * 1.4}s`,
            animationDelay: `${(i * 0.4) % 4}s`,
            opacity: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: `2px solid ${["#FF3DA0","#4DAEEA","#3EC9C9","#FF9F43"][i % 4]}`,
              background: `${["#FF3DA0","#4DAEEA","#3EC9C9","#FF9F43"][i % 4]}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: ["#FF3DA0","#4DAEEA","#3EC9C9","#FF9F43"][i % 4],
              fontFamily: "var(--font-display)",
            }}
          >
            {sym}
          </div>
        </div>
      ))}

      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center"
        style={{ background: "#FAF6F0", zIndex: 1 }}>

        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-lg mx-auto space-y-8">

          {/* Confirmed element tile */}
          <div className="flex justify-center pop-in">
            <div
              className="w-28 h-28 rounded-2xl border-4 flex flex-col items-center justify-center shadow-xl"
              style={{
                borderColor: "#FF3DA0",
                background: "#FF3DA010",
                boxShadow: "0 8px 48px #FF3DA050",
              }}
            >
              <span className="text-[10px] font-mono text-[#FF3DA0]/50 self-start ml-3 leading-none">✓</span>
              <span
                className="text-3xl font-extrabold text-[#FF3DA0] leading-none mt-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                OK!
              </span>
              <span
                className="text-[9px] font-semibold text-[#FF3DA0]/60 uppercase tracking-wider mt-1"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Confirmed
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3 fade-up" style={{ animationDelay: "0.2s" }}>
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF3DA0]"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Order Confirmed
            </span>
            <h1 className="leading-tight">
              <span
                className="block text-4xl sm:text-5xl font-extrabold text-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your formula is
              </span>
              <span
                className="block text-4xl sm:text-5xl text-[#FF3DA0] mt-1"
                style={{ fontFamily: "var(--font-script)", fontWeight: 400 }}
              >
                synthesizing!
              </span>
            </h1>
          </div>

          <p className="text-base text-black/50 leading-relaxed max-w-sm mx-auto fade-up" style={{ animationDelay: "0.35s" }}>
            Thanks{customerName !== "Scientist" ? `, ${customerName.split(" ")[0]}` : ""}! Your batch is in the queue.
            {customerEmail && (
              <> A confirmation has been sent to <strong className="text-black/70">{customerEmail}</strong>.</>
            )}
          </p>

          {/* What happens next */}
          <div
            className="rounded-2xl border-2 p-6 text-left space-y-4 fade-up"
            style={{ borderColor: "rgba(255,61,160,0.12)", background: "white", animationDelay: "0.5s" }}
          >
            <h3
              className="text-sm font-extrabold text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What happens next
            </h3>
            {[
              { step: "01", text: "We review and confirm your order within 24 hours." },
              { step: "02", text: "Your batch gets baked fresh — no pre-baked cookies here." },
              { step: "03", text: "We contact you for pickup scheduling or shipping details." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span
                  className="text-xs font-bold text-[#FF3DA0]/60 shrink-0 mt-0.5"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {s.step}
                </span>
                <p className="text-sm text-black/55 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up" style={{ animationDelay: "0.65s" }}>
            <Link
              href="/menu"
              className="rounded-2xl bg-[#FF3DA0] text-white font-extrabold text-base px-8 py-3.5
                         hover:bg-[#FF66C4] transition-all shadow-md hover:-translate-y-0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Back to the Lab →
            </Link>
            <Link
              href="/"
              className="rounded-2xl border-2 border-black/15 text-black/60 font-extrabold text-base px-8 py-3.5
                         hover:border-[#FF3DA0] hover:text-[#FF3DA0] transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
