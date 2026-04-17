import Link from "next/link"

const LINKS = {
  Shop: [
    { label: "The Elements (Menu)", href: "/menu" },
    { label: "Build a Batch", href: "/order" },
    { label: "Pickup & Delivery", href: "/order#fulfillment" },
    { label: "Shipping", href: "/order#fulfillment" },
  ],
  Explore: [
    { label: "The Lab", href: "/the-lab" },
    { label: "Events & Pop-ups", href: "/events" },
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Account: [
    { label: "Sign In", href: "/account" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Saved Formulas", href: "/account/favorites" },
  ],
}

export function Footer() {
  return (
    <footer className="text-white mt-auto" style={{ background: "#1a1a4e" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand col */}
        <div className="space-y-4">
          <span
            className="text-xl font-extrabold leading-none block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kurious<span className="text-[#FF3DA0]">Cookie</span>
            <span className="text-white/35 font-semibold"> Lab</span>
          </span>
          <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
            Science baked into every bite.
            Guilford County, NC — shipping nationwide.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href="https://www.instagram.com/kuriouscookielab/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center
                         text-[10px] font-bold text-white/50 hover:border-[#FF3DA0] hover:text-[#FF3DA0] transition-colors"
            >
              IG
            </a>
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">
              {section}
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10" style={{ background: "#13133a" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>© {new Date().getFullYear()} Kurious Cookie Lab. All rights reserved.</span>
          <span>Baked fresh in Guilford County, NC</span>
        </div>
      </div>
    </footer>
  )
}
