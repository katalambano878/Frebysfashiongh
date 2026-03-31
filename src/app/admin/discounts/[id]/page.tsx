"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"

type DiscType = "percent" | "fixed" | "free_shipping"

function toLocalInput(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditDiscountPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<DiscType>("percent")
  const [value, setValue] = useState("")
  const [minSpend, setMinSpend] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("id", id)
        .single()
      if (error || !data) {
        router.replace("/admin/discounts")
        return
      }
      setCode(data.code ?? "")
      setDescription(data.description ?? "")
      setDiscountType((data.discount_type as DiscType) ?? "percent")
      setValue(
        data.value != null && data.discount_type !== "free_shipping"
          ? String(data.value)
          : "",
      )
      setMinSpend(data.min_spend != null ? String(data.min_spend) : "")
      setMaxUses(data.max_uses != null ? String(data.max_uses) : "")
      setStartsAt(toLocalInput(data.starts_at))
      setEndsAt(toLocalInput(data.ends_at))
      setIsActive(data.is_active ?? true)
      setLoading(false)
    }
    void load()
  }, [id, router])

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    const val =
      discountType === "free_shipping"
        ? null
        : Number.parseFloat(value)
    const minS = minSpend.trim() ? Number.parseFloat(minSpend) : null
    const maxU = maxUses.trim() ? Number.parseInt(maxUses, 10) : null
    await supabase
      .from("discounts")
      .update({
        code: code.trim().toUpperCase(),
        description: description.trim() || null,
        discount_type: discountType,
        value: discountType === "free_shipping" ? null : val,
        min_spend: Number.isFinite(minS as number) ? minS : null,
        max_uses: Number.isFinite(maxU as number) ? maxU : null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        is_active: isActive,
      })
      .eq("id", id)
    setSaving(false)
    router.refresh()
  }

  const remove = async () => {
    if (!confirm("Delete this discount code?")) return
    const supabase = createClient()
    await supabase.from("discounts").delete().eq("id", id)
    router.push("/admin/discounts")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-slate-600"
        render={<Link href="/admin/discounts" />}
      >
        <ArrowLeft className="size-4" />
        Discounts
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Edit discount</h1>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => void remove()}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscType)}
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount (GHS)</option>
              <option value="free_shipping">Free shipping</option>
            </select>
          </div>
          {discountType !== "free_shipping" && (
            <div className="space-y-1.5">
              <Label htmlFor="value">
                {discountType === "percent" ? "Percent" : "Amount (GHS)"}
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min={0}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="min">Min spend (optional)</Label>
              <Input
                id="min"
                type="number"
                step="0.01"
                min={0}
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxu">Max uses (optional)</Label>
              <Input
                id="maxu"
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="start">Starts (optional)</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Ends (optional)</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(v) => setIsActive(v === true)}
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
          <div className="flex justify-end pt-2">
            <Button type="button" onClick={() => void save()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
