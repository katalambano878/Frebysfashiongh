"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ShieldCheck,
  LockKeyhole,
  UserCog,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function normalizeNextPath(raw: string | null): string | null {
  if (!raw) return null
  if (!raw.startsWith("/") || raw.startsWith("//")) return null
  if (raw.startsWith("/auth")) return null
  return raw
}

function isPrivilegedPath(path: string): boolean {
  return path.startsWith("/admin") || path.startsWith("/superadmin")
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const safeNextPath = normalizeNextPath(searchParams.get("next"))

    const user = authData.user ?? (await supabase.auth.getUser()).data.user
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const role = profile?.role ?? null
      const hasAdminAccess = role === "superadmin" || role === "admin" || role === "staff"

      if (safeNextPath) {
        if (isPrivilegedPath(safeNextPath)) {
          router.push(hasAdminAccess || profileError ? safeNextPath : "/account")
        } else {
          router.push(safeNextPath)
        }
      } else if (hasAdminAccess) {
        router.push("/admin")
      } else {
        router.push("/account")
      }
    } else {
      router.push("/")
    }
    router.refresh()
  }

  return (
    <div className="relative isolate overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.18),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.12),_transparent_55%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="hidden rounded-3xl bg-navy p-10 text-white shadow-2xl lg:block"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="size-3.5" />
            Admin Access
          </p>
          <h1 className="mt-6 font-heading text-4xl leading-tight">
            Manage Frebys Fashion GH from one secure dashboard
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
            Update collections, manage orders, and control homepage content with
            role-based access built for your team.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <ShieldCheck className="mt-0.5 size-5 text-rose-300" />
              <div>
                <p className="font-semibold">Protected admin area</p>
                <p className="text-sm text-white/75">
                  Sign-in checks your assigned role before granting dashboard access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <UserCog className="mt-0.5 size-5 text-rose-300" />
              <div>
                <p className="font-semibold">Team-ready permissions</p>
                <p className="text-sm text-white/75">
                  Admin and staff roles can collaborate while customer accounts stay isolated.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <LockKeyhole className="mt-0.5 size-5 text-rose-300" />
              <div>
                <p className="font-semibold">Secure authentication</p>
                <p className="text-sm text-white/75">
                  Login is handled through Supabase Auth with encrypted credential flow.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-full"
        >
          <div className="rounded-3xl border border-rose-border/60 bg-white/95 p-7 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)] backdrop-blur sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-primary">
                Admin Portal
              </p>
              <h2 className="mt-3 font-heading text-3xl text-navy">Welcome Back</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to manage products, orders, and store content.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@frebys.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-rose-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-rose-primary text-base text-white hover:bg-rose-primary/90"
              >
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Sign in to Admin
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Access is restricted to approved staff roles only.
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need a team account?{" "}
              <Link href="/contact" className="inline-flex items-center gap-1 font-medium text-rose-primary hover:underline">
                Contact support
                <ArrowRight className="size-3.5" />
              </Link>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
