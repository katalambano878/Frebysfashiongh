"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAdminUser } from "@/lib/hooks/use-admin-user"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Loader2, Save, CheckCircle2 } from "lucide-react"

function canEditHomeContent(role: string | undefined) {
  return role === "admin" || role === "superadmin"
}

export default function AdminHomepagePage() {
  const { profile, loading: authLoading } = useAdminUser()
  const [loading, setLoading] = useState(true)
  const [jsonText, setJsonText] = useState("[]")
  const [parseError, setParseError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const allowed = canEditHomeContent(profile?.role)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("home_content")
        .select("sections")
        .eq("id", 1)
        .single()
      const sections = data?.sections
      try {
        setJsonText(
          JSON.stringify(
            sections ?? [],
            null,
            2,
          ),
        )
        setParseError(null)
      } catch {
        setJsonText("[]")
      }
      setLoading(false)
    }
    void load()
  }, [])

  const validate = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText)
      if (!Array.isArray(parsed)) {
        setParseError("Root must be a JSON array of section objects.")
        return null
      }
      setParseError(null)
      return parsed
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON")
      return null
    }
  }, [jsonText])

  const save = useCallback(async () => {
    if (!allowed) return
    const sections = validate()
    if (sections == null) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    await supabase
      .from("home_content")
      .update({
        sections,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [allowed, validate])

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Homepage</h1>
      <p className="text-sm text-slate-500">
        Homepage layout is stored as a JSON array of sections. Coordinate with
        the storefront to match the shape it expects.
      </p>

      {!allowed && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Only <strong>admin</strong> and <strong>superadmin</strong> roles can
          update homepage content. You can still view the current JSON.
        </p>
      )}

      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="size-5 text-rose-600" />
            Sections (JSON)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value)
              setParseError(null)
            }}
            rows={18}
            className="font-mono text-xs"
            readOnly={!allowed}
          />
          {parseError && (
            <p className="text-sm text-destructive">{parseError}</p>
          )}
          {allowed && (
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void save()}
                disabled={saving}
              >
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
