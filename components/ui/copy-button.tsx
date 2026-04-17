"use client"

import { useState } from "react"

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full px-3 py-1.5 transition-all hover:-translate-y-0.5"
      style={{
        fontFamily: "var(--font-oswald)",
        letterSpacing: "0.06em",
        background: copied ? "#3EC9C9" : "rgba(0,0,0,0.07)",
        color: copied ? "white" : "rgba(0,0,0,0.65)",
        border: `1.5px solid ${copied ? "#3EC9C9" : "rgba(0,0,0,0.12)"}`,
        boxShadow: copied ? "0 2px 8px #3EC9C940" : "none",
      }}
    >
      {copied ? "✓ Copied!" : `Copy ${label}`}
    </button>
  )
}
