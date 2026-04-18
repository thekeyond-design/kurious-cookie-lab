"use client"

import { useEffect, useRef, useState } from "react"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "none"
  id?: string
}

export function FadeIn({ children, className = "", delay = 0, direction = "up", id }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const translate = {
    up:    "translateY(28px)",
    left:  "translateX(-28px)",
    right: "translateX(28px)",
    none:  "none",
  }[direction]

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translate,
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
