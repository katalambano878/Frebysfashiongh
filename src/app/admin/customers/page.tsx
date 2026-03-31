"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Search } from "lucide-react"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchCustomers() {
      const supabase = createClient()
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "customer")
          .order("created_at", { ascending: false })
        setCustomers(data ?? [])
      } catch {
        // empty state will render
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q),
    )
  }, [customers, search])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name or email…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="size-9 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-44 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Users className="mb-3 size-12" />
              <p className="text-base font-medium">No customers yet</p>
              <p className="mt-1 text-sm">
                {search
                  ? "No customers match your search"
                  : "Customers will appear here once they sign up"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((customer) => (
                    <tr
                      key={customer.id}
                      className="text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-semibold text-rose-600">
                            {(customer.full_name ?? customer.email ?? "?")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <span className="font-medium text-slate-800">
                            {customer.full_name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {customer.email ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {customer.phone ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-slate-100 text-slate-600 capitalize">
                          {customer.role}
                        </Badge>
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
