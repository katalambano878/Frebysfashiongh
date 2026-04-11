"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DEFAULT_ROLE_PERMISSIONS,
  MANAGEABLE_ROLES,
  PERMISSION_KEYS,
  PERMISSION_LABELS,
  type ManageableRole,
  type PermissionKey,
} from "@/lib/admin/role-permissions"
import {
  CheckCircle2,
  Loader2,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"

type StaffMember = {
  id: string
  email: string | null
  full_name: string | null
  role: string
  created_at: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function TeamPage() {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [viewerRole, setViewerRole] = useState<string | null>(null)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [permissionsByRole, setPermissionsByRole] = useState(DEFAULT_ROLE_PERMISSIONS)
  const [savedPermissions, setSavedPermissions] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<ManageableRole>("staff")

  const canManageRoles = viewerRole === "superadmin"

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/team", { method: "GET" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to load team")

      setViewerRole(json.viewerRole ?? null)
      setStaffMembers(Array.isArray(json.staffMembers) ? json.staffMembers : [])

      const base = { ...DEFAULT_ROLE_PERMISSIONS }
      if (Array.isArray(json.rolePermissions)) {
        for (const row of json.rolePermissions) {
          const r = String(row.role ?? "")
          if (MANAGEABLE_ROLES.includes(r as ManageableRole)) {
            base[r as ManageableRole] = {
              ...base[r as ManageableRole],
              ...(row.permissions ?? {}),
            }
          }
        }
      }
      setPermissionsByRole(base)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load team data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTeam()
  }, [fetchTeam])

  const roleCounts = useMemo(() => {
    return {
      superadmin: staffMembers.filter((m) => m.role === "superadmin").length,
      admin: staffMembers.filter((m) => m.role === "admin").length,
      staff: staffMembers.filter((m) => m.role === "staff").length,
    }
  }, [staffMembers])

  async function runAction(action: string, payload: Record<string, unknown>) {
    setBusy(action)
    setError("")
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Action failed")
      return json
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed")
      return null
    } finally {
      setBusy(null)
    }
  }

  async function createStaff() {
    const result = await runAction("create", {
      email,
      password,
      fullName,
      role,
    })
    if (!result) return
    setEmail("")
    setPassword("")
    setFullName("")
    setRole("staff")
    await fetchTeam()
  }

  async function updateRole(userId: string, nextRole: ManageableRole) {
    const result = await runAction("updateRole", { userId, role: nextRole })
    if (!result) return
    await fetchTeam()
  }

  async function demoteToCustomer(userId: string) {
    const result = await runAction("demoteToCustomer", { userId })
    if (!result) return
    await fetchTeam()
  }

  async function savePermissions() {
    const result = await runAction("updateRolePermissions", { permissionsByRole })
    if (!result) return
    setSavedPermissions(true)
    setTimeout(() => setSavedPermissions(false), 1800)
    await fetchTeam()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Team & Roles</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Superadmins</p>
              <p className="text-2xl font-semibold text-slate-900">{roleCounts.superadmin}</p>
            </div>
            <Shield className="size-6 text-rose-500" />
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Admins</p>
              <p className="text-2xl font-semibold text-slate-900">{roleCounts.admin}</p>
            </div>
            <Users className="size-6 text-slate-500" />
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Staff</p>
              <p className="text-2xl font-semibold text-slate-900">{roleCounts.staff}</p>
            </div>
            <Users className="size-6 text-slate-500" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <div className="mt-4 space-y-4">
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Add Staff User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@frebys.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staff-password">Temporary Password</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staff-name">Full Name</Label>
                    <Input
                      id="staff-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Staff name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as ManageableRole)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => void createStaff()}
                    disabled={busy === "create" || !canManageRoles}
                  >
                    {busy === "create" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <UserPlus className="size-4" />
                    )}
                    Add Staff User
                  </Button>
                </div>
                {!canManageRoles && (
                  <p className="text-xs text-slate-500">
                    Only superadmin can create and modify staff roles.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Staff Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 text-sm text-slate-500">Loading team members...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3">Joined</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {staffMembers.map((member) => (
                          <tr key={member.id} className="text-slate-700">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">
                                {member.full_name ?? "—"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{member.email ?? "—"}</td>
                            <td className="px-6 py-4">
                              <Select
                                value={member.role}
                                onValueChange={(v) => void updateRole(member.id, v as ManageableRole)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="superadmin">Superadmin</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {formatDate(member.created_at)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => void demoteToCustomer(member.id)}
                                  disabled={!canManageRoles}
                                  className="gap-1.5"
                                >
                                  <Trash2 className="size-3.5" />
                                  Remove access
                                </Button>
                              </div>
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
        </TabsContent>

        <TabsContent value="roles">
          <Card className="mt-4 rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {MANAGEABLE_ROLES.map((targetRole) => (
                <div key={targetRole} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize text-slate-900">{targetRole}</p>
                    <Badge className="bg-slate-100 text-slate-700 capitalize">{targetRole}</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {PERMISSION_KEYS.map((permission) => (
                      <label
                        key={`${targetRole}-${permission}`}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2"
                      >
                        <Checkbox
                          checked={permissionsByRole[targetRole][permission]}
                          onCheckedChange={(checked) => {
                            setPermissionsByRole((prev) => ({
                              ...prev,
                              [targetRole]: {
                                ...prev[targetRole],
                                [permission]: Boolean(checked),
                              },
                            }))
                          }}
                          disabled={!canManageRoles}
                        />
                        <span className="text-sm text-slate-700">{PERMISSION_LABELS[permission as PermissionKey]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button
                  onClick={() => void savePermissions()}
                  disabled={!canManageRoles || busy === "updateRolePermissions"}
                >
                  {busy === "updateRolePermissions" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : savedPermissions ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Shield className="size-4" />
                  )}
                  {busy === "updateRolePermissions"
                    ? "Saving..."
                    : savedPermissions
                      ? "Saved"
                      : "Save Permissions"}
                </Button>
              </div>
              {!canManageRoles && (
                <p className="text-xs text-slate-500">
                  Only superadmin can change role permissions.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
