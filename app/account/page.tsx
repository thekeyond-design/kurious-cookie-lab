"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/client"
import { Suspense } from "react"

function AccountForm() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) setError(decodeURIComponent(err))
  }, [searchParams])

  // Redirect if already signed in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/account/orders")
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push("/account/orders")
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
      else setSuccess("Check your email to confirm your account, then sign in.")
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/callback?next=/account/reset-password`,
      })
      if (error) setError(error.message)
      else setSuccess("Password reset email sent — check your inbox.")
    }

    setLoading(false)
  }

  async function handleOAuth(provider: "google" | "facebook" | "apple") {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: "#1a1a4e" }}>
          <Link href="/" className="inline-block mb-4">
            <span className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              Kurious<span className="text-[#FF3DA0]">Cookie</span>
              <span className="text-white/40"> Lab</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {mode === "forgot" ? "Reset Password" : mode === "signup" ? "Join the Lab" : "Enter the Lab"}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {mode === "forgot"
              ? "We'll send a reset link to your email."
              : mode === "signup"
              ? "Create your account to track orders."
              : "Sign in to your account."}
          </p>
        </div>

        <div className="px-8 py-7 space-y-5">
          {/* Mode tabs */}
          {mode !== "forgot" && (
            <div className="flex rounded-xl border-2 border-black/8 overflow-hidden">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                  className="flex-1 py-2.5 text-sm font-bold transition-all"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: mode === m ? "#1a1a4e" : "transparent",
                    color: mode === m ? "white" : "rgba(0,0,0,0.45)",
                  }}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {/* Social buttons */}
          {mode !== "forgot" && (
            <div className="space-y-2.5">
              <button
                onClick={() => handleOAuth("google")}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-black/10 py-3 text-sm font-semibold text-black/70 hover:border-black/25 hover:bg-black/[0.02] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuth("facebook")}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-black/10 py-3 text-sm font-semibold text-black/70 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/[0.03] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button
                onClick={() => handleOAuth("apple")}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-black/10 py-3 text-sm font-semibold text-black/70 hover:border-black/25 hover:bg-black/[0.02] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Continue with Apple
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-black/8" />
                <span className="text-xs text-black/30 font-medium">or</span>
                <div className="flex-1 h-px bg-black/8" />
              </div>
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-black/50 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Malia Walker"
                  className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#FF3DA0] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black/50 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#FF3DA0] transition-colors"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-bold text-black/50 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-black/10 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#FF3DA0] transition-colors"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-[#3EC9C9] bg-[#3EC9C9]/5 rounded-xl px-4 py-3 border border-[#3EC9C9]/20">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#FF3DA0", fontFamily: "var(--font-display)" }}
            >
              {loading
                ? "One moment..."
                : mode === "forgot"
                ? "Send Reset Email"
                : mode === "signup"
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center space-y-2 pt-1">
            {mode === "signin" && (
              <button
                onClick={() => { setMode("forgot"); setError(null); setSuccess(null) }}
                className="text-xs text-black/40 hover:text-[#FF3DA0] transition-colors"
              >
                Forgot your password?
              </button>
            )}
            {mode === "forgot" && (
              <button
                onClick={() => { setMode("signin"); setError(null); setSuccess(null) }}
                className="text-xs text-black/40 hover:text-[#FF3DA0] transition-colors"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-screen"
        style={{ background: "#FAF6F0" }}
      >
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #FF3DA0 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative w-full max-w-md">
          <Suspense>
            <AccountForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
