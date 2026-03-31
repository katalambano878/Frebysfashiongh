import { Suspense } from "react"
import { SettingsPageClient } from "./settings-client"

function SettingsFallback() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsPageClient />
    </Suspense>
  )
}
