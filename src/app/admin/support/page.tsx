"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Ticket = {
  id: string
  ticket_number: string
  subject: string
  customer_email: string | null
  status: string
  priority: string
  created_at: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [subject, setSubject] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("medium")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [setupRequired, setSetupRequired] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/admin/support/tickets", { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error ?? "Failed to load tickets")
      setLoading(false)
      return
    }
    setTickets(json.tickets ?? [])
    setSetupRequired(Boolean(json.setupRequired))
    if (json.message) setError(json.message)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  async function createTicket() {
    if (setupRequired) return
    setSaving(true)
    setError(null)
    const res = await fetch("/api/admin/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, customerEmail, priority, message }),
    })
    setSaving(false)
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error ?? "Failed to create ticket")
      return
    }
    setSubject("")
    setCustomerEmail("")
    setMessage("")
    await load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Support CRM</h1>

      {error ? (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="py-3 text-sm text-amber-800">{error}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create Ticket</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Order issue / delivery question" />
          </div>
          <div>
            <Label>Customer email</Label>
            <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@email.com" />
          </div>
          <div>
            <Label>Priority</Label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>First message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue..." />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => void createTicket()} disabled={saving || !subject.trim() || setupRequired}>
              {saving ? "Creating..." : "Create ticket"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-slate-500">
                    <th className="py-2">Ticket</th>
                    <th className="py-2">Subject</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b">
                      <td className="py-2">
                        <Link href={`/admin/support/tickets/${ticket.id}`} className="text-rose-700 hover:underline">
                          {ticket.ticket_number}
                        </Link>
                      </td>
                      <td className="py-2">{ticket.subject}</td>
                      <td className="py-2">{ticket.customer_email || "—"}</td>
                      <td className="py-2 capitalize">{ticket.status}</td>
                      <td className="py-2 capitalize">{ticket.priority}</td>
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
