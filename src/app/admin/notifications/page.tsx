"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Campaign = {
  id: string
  name: string
  channel: string
  audience: string
  status: string
  message: string
  scheduled_at: string | null
}

export default function NotificationsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [name, setName] = useState("")
  const [channel, setChannel] = useState("email")
  const [audience, setAudience] = useState("all_customers")
  const [status, setStatus] = useState("draft")
  const [scheduledAt, setScheduledAt] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [setupRequired, setSetupRequired] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    scheduled: 0,
    sent: 0,
    dueNow: 0,
  })

  async function load() {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/admin/marketing/campaigns", { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error ?? "Failed to load marketing campaigns")
      setLoading(false)
      return
    }
    setCampaigns(json.campaigns ?? [])
    setSetupRequired(Boolean(json.setupRequired))
    setStats(
      json.stats ?? {
        total: 0,
        draft: 0,
        scheduled: 0,
        sent: 0,
        dueNow: 0,
      },
    )
    if (json.message) setError(json.message)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  async function createCampaign() {
    if (setupRequired) return
    setSaving(true)
    setError(null)
    const res = await fetch("/api/admin/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        name,
        channel,
        audience,
        message,
        status,
        scheduledAt: scheduledAt || null,
      }),
    })
    setSaving(false)
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error ?? "Failed to create campaign")
      return
    }
    setName("")
    setMessage("")
    setScheduledAt("")
    await load()
  }

  async function markSent(id: string) {
    if (setupRequired) return
    const campaign = campaigns.find((item) => item.id === id)
    if (!campaign) return

    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "campaign",
        payload: {
          subject: campaign.name,
          message: campaign.message,
          channels: {
            email: campaign.channel === "email" || campaign.channel === "push",
            sms: campaign.channel === "sms" || campaign.channel === "whatsapp",
          },
        },
      }),
    })

    await fetch("/api/admin/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setStatus", id, status: "sent" }),
    })
    await load()
  }

  function applyPreset(preset: "launch" | "abandoned" | "vip") {
    if (preset === "launch") {
      setName("New Collection Launch Blast")
      setChannel("email")
      setAudience("all_customers")
      setMessage("Our latest kids Ankara drop is live. Shop now before top sizes sell out.")
      return
    }
    if (preset === "abandoned") {
      setName("Abandoned Cart Recovery")
      setChannel("whatsapp")
      setAudience("abandoned_cart")
      setMessage("You left some beautiful styles in your cart. Complete your order and enjoy fast delivery.")
      return
    }
    setName("VIP Repeat Buyer Offer")
    setChannel("sms")
    setAudience("vip_customers")
    setMessage("Exclusive VIP drop: early access + bonus styling support for your next order.")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Marketing Automation</h1>

      <div className="grid gap-4 md:grid-cols-5">
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Total</p><p className="mt-1 text-lg font-semibold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Draft</p><p className="mt-1 text-lg font-semibold">{stats.draft}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Scheduled</p><p className="mt-1 text-lg font-semibold">{stats.scheduled}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Sent</p><p className="mt-1 text-lg font-semibold">{stats.sent}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-slate-500">Due Now</p><p className="mt-1 text-lg font-semibold">{stats.dueNow}</p></CardContent></Card>
      </div>

      {error ? (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="py-3 text-sm text-amber-800">{error}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("launch")}>Preset: Launch</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("abandoned")}>Preset: Abandoned Cart</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("vip")}>Preset: VIP Offer</Button>
          </div>
          <div className="md:col-span-2">
            <Label>Campaign name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Easter style drop campaign" />
          </div>
          <div>
            <Label>Channel</Label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div>
            <Label>Audience</Label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="all_customers">All customers</option>
              <option value="vip_customers">VIP customers</option>
              <option value="new_customers">New customers</option>
              <option value="abandoned_cart">Abandoned cart</option>
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div>
            <Label>Schedule time</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Campaign copy..." />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => void createCampaign()} disabled={saving || !name.trim() || !message.trim() || setupRequired}>
              {saving ? "Saving..." : "Create campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-slate-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Channel</th>
                    <th className="py-2">Audience</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b">
                      <td className="py-2">{campaign.name}</td>
                      <td className="py-2 capitalize">{campaign.channel}</td>
                      <td className="py-2">{campaign.audience}</td>
                      <td className="py-2 capitalize">{campaign.status}</td>
                      <td className="py-2">
                        {campaign.status !== "sent" ? (
                          <Button size="sm" variant="outline" onClick={() => void markSent(campaign.id)}>
                            Mark sent
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600">Sent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
