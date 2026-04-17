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
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-3 py-1 transition-all"
      style={{
        fontFamily: "var(--font-oswald)",
        letterSpacing: "0.06em",
        background: copied ? "#3EC9C910" : "rgba(0,0,0,0.04)",
        color: copied ? "#3EC9C9" : "rgba(0,0,0,0.35)",
        border: `1px solid ${copied ? "#3EC9C940" : "transparent"}`,
      }}
    >
      {copied ? "✓ Copied!" : `Copy ${label}`}
    </button>
  )
}
