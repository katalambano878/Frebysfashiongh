"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TicketPayload = {
  ticket: {
    ticket_number: string
    subject: string
    customer_email: string | null
    status: string
    priority: string
  }
  messages: Array<{
    id: string
    sender_type: string
    body: string
    is_internal: boolean
    created_at: string
  }>
}

export default function SupportTicketPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [data, setData] = useState<TicketPayload | null>(null)
  const [status, setStatus] = useState("open")
  const [priority, setPriority] = useState("medium")
  const [newMessage, setNewMessage] = useState("")
  const [internal, setInternal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiOutput, setAiOutput] = useState("")
  const [aiBusy, setAiBusy] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    const res = await fetch(`/api/admin/support/tickets/${id}`, { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (res.ok && json) {
      setData(json)
      setStatus(json.ticket.status)
      setPriority(json.ticket.priority)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function updateTicket() {
    if (!id) return
    await fetch(`/api/admin/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateStatus", status, priority }),
    })
    await load()
  }

  async function addMessage() {
    if (!id || !newMessage.trim()) return
    await fetch(`/api/admin/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addMessage",
        body: newMessage,
        isInternal: internal,
      }),
    })
    setNewMessage("")
    setInternal(false)
    await load()
  }

  async function runAi(mode: "summary" | "reply") {
    if (!id) return
    setAiBusy(true)
    const res = await fetch("/api/admin/support/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: id,
        mode,
        prompt: aiPrompt,
      }),
    })
    const json = await res.json().catch(() => null)
    setAiBusy(false)
    if (res.ok && json?.output) {
      setAiOutput(json.output)
    }
  }

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading ticket...</div>
  if (!data) return <div className="p-4 text-sm text-red-600">Ticket not found.</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{data.ticket.ticket_number}</h1>
        <p className="text-sm text-slate-500">{data.ticket.subject}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <Button onClick={() => void updateTicket()}>Save ticket</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.messages.map((msg) => (
            <div key={msg.id} className="rounded-lg border p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {msg.sender_type} {msg.is_internal ? "• internal" : ""}
              </p>
              <p className="mt-1 text-sm text-slate-700">{msg.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Message</Label>
            <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
            Internal note only
          </label>
          <Button onClick={() => void addMessage()} disabled={!newMessage.trim()}>
            Send message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Support Copilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Instruction for AI</Label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Draft a firm but friendly response with next steps and ETA."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void runAi("summary")} disabled={aiBusy}>
              {aiBusy ? "Thinking..." : "Summarize ticket"}
            </Button>
            <Button onClick={() => void runAi("reply")} disabled={aiBusy}>
              {aiBusy ? "Thinking..." : "Draft customer reply"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setNewMessage(aiOutput)
              }}
              disabled={!aiOutput.trim()}
            >
              Use draft in message box
            </Button>
          </div>
          <Textarea
            value={aiOutput}
            onChange={(e) => setAiOutput(e.target.value)}
            placeholder="AI output will appear here..."
            className="min-h-40"
          />
        </CardContent>
      </Card>
    </div>
  )
}
