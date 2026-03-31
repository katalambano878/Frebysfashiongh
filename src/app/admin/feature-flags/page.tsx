import { redirect } from "next/navigation"

export default function AdminFeatureFlagsPage() {
  redirect("/admin/settings?tab=features")
}
