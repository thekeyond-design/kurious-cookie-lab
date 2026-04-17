"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/account")
    router.refresh()
  }

  return (
    <button
      onClick={signOut}
      className="rounded-xl border-2 border-white/20 text-white/60 text-sm font-bold px-4 py-2.5 hover:border-white/40 hover:text-white transition-all"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Sign Out
    </button>
  )
}
