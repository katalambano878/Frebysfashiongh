"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

type DiscType = "percent" | "fixed" | "free_shipping"

export default function NewDiscountPage() {
  const router = useRouter()
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

  const submit = async () => {
    const c = code.trim().toUpperCase()
    if (!c) return
    setSaving(true)
    const supabase = createClient()
    const val =
      discountType === "free_shipping"
        ? null
        : Number.parseFloat(value)
    if (discountType !== "free_shipping" && !Number.isFinite(val)) {
      setSaving(false)
      return
    }
    const minS = minSpend.trim() ? Number.parseFloat(minSpend) : null
    const maxU = maxUses.trim() ? Number.parseInt(maxUses, 10) : null
    const { data, error } = await supabase
      .from("discounts")
      .insert({
        code: c,
        description: description.trim() || null,
        discount_type: discountType,
        value: discountType === "free_shipping" ? null : val,
        min_spend: Number.isFinite(minS as number) ? minS : null,
        max_uses: Number.isFinite(maxU as number) ? maxU : null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        is_active: isActive,
      })
      .select("id")
      .single()
    setSaving(false)
    if (!error && data?.id) router.push(`/admin/discounts/${data.id}`)
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
      <h1 className="text-2xl font-bold text-slate-900">New discount</h1>
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
              placeholder="SAVE20"
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
            <Button
              type="button"
              onClick={() => void submit()}
              disabled={
                saving ||
                !code.trim() ||
                (discountType !== "free_shipping" && !value.trim())
              }
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
