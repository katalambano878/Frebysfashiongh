"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAdminUser } from "@/lib/hooks/use-admin-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, CheckCircle2 } from "lucide-react"

export default function AdminProfilePage() {
  const { user, profile, loading: authLoading } = useAdminUser()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [loadingRow, setLoadingRow] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const uid = user?.id
    if (!uid) {
      setLoadingRow(false)
      return
    }
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", uid)
        .single()
      if (data) {
        setFullName(data.full_name ?? "")
        setPhone(data.phone ?? "")
      }
      setLoadingRow(false)
    }
    void load()
  }, [user?.id])

  const save = useCallback(async () => {
    if (!user?.id) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    try {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [user?.id, fullName, phone])

  if (authLoading || loadingRow) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-48 animate-pulse rounded-xl bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      <Card className="max-w-lg rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Your account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? user?.email ?? ""}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">
              Email is managed through your sign-in provider.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Display name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233…"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? "Saving…" : saved ? "Saved" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
