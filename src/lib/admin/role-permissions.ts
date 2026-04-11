export const MANAGEABLE_ROLES = ["staff", "admin", "superadmin"] as const

export type ManageableRole = (typeof MANAGEABLE_ROLES)[number]

export const PERMISSION_KEYS = [
  "catalog_manage",
  "orders_manage",
  "fulfillment_manage",
  "customers_view",
  "content_manage",
  "discounts_manage",
  "analytics_view",
  "pos_use",
  "support_manage",
  "marketing_manage",
  "settings_manage",
  "roles_manage",
] as const

export type PermissionKey = (typeof PERMISSION_KEYS)[number]

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  catalog_manage: "Manage catalog",
  orders_manage: "Manage orders",
  fulfillment_manage: "Manage fulfillment",
  customers_view: "View customers",
  content_manage: "Manage content",
  discounts_manage: "Manage discounts",
  analytics_view: "View analytics",
  pos_use: "Use POS",
  support_manage: "Manage support CRM",
  marketing_manage: "Manage marketing",
  settings_manage: "Manage settings",
  roles_manage: "Manage roles and staff",
}

export const DEFAULT_ROLE_PERMISSIONS: Record<ManageableRole, Record<PermissionKey, boolean>> = {
  staff: {
    catalog_manage: true,
    orders_manage: true,
    fulfillment_manage: true,
    customers_view: true,
    content_manage: false,
    discounts_manage: false,
    analytics_view: true,
    pos_use: true,
    support_manage: false,
    marketing_manage: false,
    settings_manage: false,
    roles_manage: false,
  },
  admin: {
    catalog_manage: true,
    orders_manage: true,
    fulfillment_manage: true,
    customers_view: true,
    content_manage: true,
    discounts_manage: true,
    analytics_view: true,
    pos_use: true,
    support_manage: true,
    marketing_manage: true,
    settings_manage: true,
    roles_manage: false,
  },
  superadmin: {
    catalog_manage: true,
    orders_manage: true,
    fulfillment_manage: true,
    customers_view: true,
    content_manage: true,
    discounts_manage: true,
    analytics_view: true,
    pos_use: true,
    support_manage: true,
    marketing_manage: true,
    settings_manage: true,
    roles_manage: true,
  },
}

export function isManageableRole(value: string): value is ManageableRole {
  return MANAGEABLE_ROLES.includes(value as ManageableRole)
}

export function sanitizePermissions(
  input: unknown,
  fallback: Record<PermissionKey, boolean>,
): Record<PermissionKey, boolean> {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
  const normalized = { ...fallback }

  for (const key of PERMISSION_KEYS) {
    if (typeof source[key] === "boolean") {
      normalized[key] = source[key] as boolean
    }
  }

  return normalized
}
