import Link from "next/link"

export function AllergenNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border-2 px-5 py-4 text-sm leading-relaxed space-y-1.5 ${className}`}
      style={{ borderColor: "#FF9F4330", background: "#FF9F4308" }}
    >
      <p className="font-bold text-black/70">
        <span
          className="inline-block mr-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: "#3EC9C920", color: "#3EC9C9", fontFamily: "var(--font-oswald)" }}
        >
          GF
        </span>
        = Gluten-Free, made with almond flour.
      </p>
      <p className="text-black/50 text-xs leading-relaxed">
        Our kitchen processes <strong className="text-black/65">wheat, eggs, dairy, soy, and tree nuts (almonds)</strong>.
        While we take precautions, we cannot guarantee zero cross-contamination.{" "}
        <Link href="/contact" className="text-[#FF3DA0] hover:underline font-semibold">
          Contact us
        </Link>{" "}
        with specific allergy concerns.
      </p>
    </div>
  )
}
