"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({ to, suffix = "", duration = 1400, className }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.disconnect()
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * to))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
