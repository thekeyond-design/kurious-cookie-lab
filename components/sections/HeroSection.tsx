"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"

export function HeroSection({ heroImage }: { heroImage: string | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      const bg = bgRef.current
      if (!section || !bg) return
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const progress = -rect.top / (rect.height + window.innerHeight)
      bg.style.transform = `translateY(${progress * 60}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[92vh] flex flex-col">
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Kurious Cookie Lab — artisan cookies"
            fill
            className="object-cover object-center scale-[1.15]"
            priority
            quality={90}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "linear-gradient(160deg, #FAF6F0 0%, #ffe8f3 40%, #ffd4ec 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-[0.25]"
              style={{
                backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-[#FF3DA0]/20 rounded-2xl px-8 py-4 text-center">
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-[#FF3DA0]/40"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Banner Photo Goes Here
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gradient overlays — not parallaxed */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent z-[1]" />
      {heroImage && (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent z-[1]" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-end pb-20 px-4 text-center max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          <div
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] rounded-full px-5 py-1.5"
            style={{
              fontFamily: "var(--font-oswald)",
              background: heroImage ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.06)",
              color: heroImage ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.60)",
              border: heroImage ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
              backdropFilter: heroImage ? "blur(4px)" : "none",
            }}
          >
            Batch to Order &nbsp;&middot;&nbsp; Guilford County, NC
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl leading-none font-extrabold text-black">
            <span style={{ fontFamily: "var(--font-display)" }}>Where Your Curiosity</span>
            <br />
            <span
              className="text-[#FF3DA0]"
              style={{
                fontFamily: "var(--font-script)",
                fontWeight: 400,
                fontSize: "0.95em",
                textShadow: "0 3px 16px rgba(180, 0, 80, 0.32)",
              }}
            >
              Takes a Bite.
            </span>
          </h1>

          <p className="text-lg text-black/65 max-w-md mx-auto leading-relaxed">
            Artisan cookies built like chemistry. Pick your elements,
            build your formula, taste the reaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/order"
              className="lab-glow-btn rounded-2xl bg-[#FF3DA0] text-white font-bold text-lg px-10 py-4
                         active:scale-95 shadow-lg hover:-translate-y-0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Enter the Lab →
            </Link>
            <Link
              href="/menu"
              className="rounded-2xl border-2 font-bold text-lg px-10 py-4 transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                fontFamily: "var(--font-display)",
                borderColor: "rgba(0,0,0,0.25)",
                color: "rgba(0,0,0,0.80)",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
              }}
            >
              View All Elements
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-[#FF3DA0] text-sm tracking-tight">★★★★★</span>
            <span className="text-black/40 text-sm">Loved by cookie scientists everywhere</span>
          </div>
        </div>
      </div>
    </section>
  )
}
