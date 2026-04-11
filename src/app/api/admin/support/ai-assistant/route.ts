import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdminApi } from "@/lib/admin/require-admin-api"

type ChatMessage = { role: "user" | "assistant" | "system"; content: string }

function heuristicReply(subject: string, transcript: string, prompt: string) {
  const safety = "Be polite, concise, and never promise refunds until order verification is complete."
  return [
    `Subject context: ${subject || "General support request"}.`,
    "Draft reply:",
    `Hi there, thanks for reaching out. ${prompt || "I reviewed your request and I am here to help."}`,
    "I have checked the details on our side and will update you with the next concrete step shortly.",
    "If you can share your order number and preferred resolution (exchange, replacement, or refund), we will resolve this faster.",
    safety,
    transcript ? `Internal context used: ${transcript.slice(0, 400)}...` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

function heuristicSummary(subject: string, transcript: string) {
  const lines = transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-8)
  return [
    `Ticket summary for "${subject || "untitled ticket"}":`,
    `- Recent conversation points: ${lines.length ? lines.join(" | ") : "No messages yet"}`,
    "- Recommended next action: acknowledge customer concern, verify order details, propose resolution options, and provide ETA.",
    "- Risk flag: if delivery delay or damaged item is mentioned, escalate priority to high.",
  ].join("\n")
}

async function callOpenAI(messages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages,
    }),
  })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return json?.choices?.[0]?.message?.content as string | undefined
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminApi("support_manage")
  if (errorResponse) return errorResponse

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const ticketId = String((body as { ticketId?: string }).ticketId ?? "").trim()
  const prompt = String((body as { prompt?: string }).prompt ?? "").trim()
  const mode = String((body as { mode?: string }).mode ?? "reply")
  const chatHistory = ((body as { chatHistory?: ChatMessage[] }).chatHistory ??
    []) as ChatMessage[]

  let subject = ""
  let transcript = ""

  if (ticketId) {
    const admin = createAdminClient()
    const [{ data: ticket }, { data: messages }] = await Promise.all([
      admin
        .from("support_tickets")
        .select("subject")
        .eq("id", ticketId)
        .maybeSingle(),
      admin
        .from("support_messages")
        .select("sender_type, body, created_at")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true }),
    ])
    subject = ticket?.subject ?? ""
    transcript = (messages ?? [])
      .map((msg) => `${msg.sender_type}: ${msg.body}`)
      .join("\n")
  }

  const system = `You are a senior ecommerce support assistant for Frebys Fashion GH.
Write practical, empathetic, brand-safe support output.
Avoid legal claims, avoid guaranteed refunds without checks, and keep a helpful tone.`

  const aiOutput = await callOpenAI([
    { role: "system", content: system },
    ...chatHistory,
    {
      role: "user",
      content: `Mode: ${mode}\nPrompt: ${prompt}\nSubject: ${subject}\nTranscript:\n${transcript}`,
    },
  ])

  if (aiOutput) {
    return NextResponse.json({ output: aiOutput, provider: "openai" })
  }

  const output =
    mode === "summary"
      ? heuristicSummary(subject, transcript)
      : heuristicReply(subject, transcript, prompt)
  return NextResponse.json({ output, provider: "fallback" })
}
