"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Store,
  CreditCard,
  Flag,
  Save,
  Loader2,
  CheckCircle2,
  Paintbrush,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react"

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        checked ? "bg-rose-600" : "bg-slate-300",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  )
}

const FEATURE_FLAGS = [
  { key: "reviews", label: "Reviews" },
  { key: "loyalty", label: "Loyalty" },
  { key: "referrals", label: "Referrals" },
  { key: "bundles", label: "Bundles" },
  { key: "abandoned_cart", label: "Abandoned Cart" },
  { key: "store_credit", label: "Store Credit" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "staff_chat", label: "Staff Chat" },
  { key: "advanced_analytics", label: "Advanced Analytics" },
  { key: "instagram_shop", label: "Instagram Shop" },
]

const PAYMENT_PROVIDERS = [
  { key: "moolre", label: "Mobile Money", description: "Mobile money checkout" },
  { key: "paystack", label: "Card Payment", description: "Cards & bank transfer (Paystack)" },
]

type HeroSlide = { image_url: string; alt: string }
type HeroContent = {
  headline: string
  subheadline: string
  cta_primary: string
  cta_secondary: string
  slides: HeroSlide[]
}

const DEFAULT_HERO: HeroContent = {
  headline: "Luxury That Fits Your Everyday",
  subheadline: "Bags, shoes, dresses & perfumes — curated for confident women.",
  cta_primary: "Shop New Arrivals",
  cta_secondary: "Explore Collections",
  slides: [],
}

type TabKey = "general" | "payments" | "features" | "branding"

function tabFromSearchParam(raw: string | null): TabKey {
  if (raw === "payments" || raw === "features" || raw === "flags" || raw === "branding") {
    return raw === "flags" ? "features" : raw as TabKey
  }
  return "general"
}

export function SettingsPageClient() {
  const searchParams = useSearchParams()
  const defaultTab = useMemo(
    () => tabFromSearchParam(searchParams.get("tab")),
    [searchParams],
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [storeName, setStoreName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [announcement, setAnnouncement] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const [paymentProviders, setPaymentProviders] = useState<
    Record<string, { enabled: boolean }>
  >({})
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({})

  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO)
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [savingBranding, setSavingBranding] = useState(false)
  const [savedBranding, setSavedBranding] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      try {
        const [storefrontRes, siteRes] = await Promise.all([
          supabase.from("storefront_settings").select("*").eq("id", 1).single(),
          supabase.from("site_settings").select("*").eq("id", 1).single(),
        ])

        if (storefrontRes.data) {
          setStoreName(storefrontRes.data.store_name ?? "")
          setSupportEmail(storefrontRes.data.support_email ?? "")
          setWhatsapp(storefrontRes.data.whatsapp_number ?? "")
          setAnnouncement(storefrontRes.data.announcement_bar ?? "")
          setMaintenanceMode(storefrontRes.data.maintenance_mode ?? false)
          setHeroContent({ ...DEFAULT_HERO, ...(storefrontRes.data.hero_content ?? {}) })
          setLogoUrl(storefrontRes.data.logo_url ?? "")
          setFaviconUrl(storefrontRes.data.favicon_url ?? "")
        }

        if (siteRes.data) {
          setPaymentProviders(siteRes.data.payment_providers ?? {})
          setFeatureFlags(siteRes.data.feature_flags ?? {})
        }
      } catch {
        // defaults will render
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const saveGeneral = useCallback(async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    try {
      await supabase
        .from("storefront_settings")
        .update({
          store_name: storeName,
          support_email: supportEmail,
          whatsapp_number: whatsapp,
          announcement_bar: announcement,
          maintenance_mode: maintenanceMode,
        })
        .eq("id", 1)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // handle silently
    } finally {
      setSaving(false)
    }
  }, [storeName, supportEmail, whatsapp, announcement, maintenanceMode])

  const toggleProvider = useCallback(
    async (key: string) => {
      const updated = {
        ...paymentProviders,
        [key]: {
          ...paymentProviders[key],
          enabled: !paymentProviders[key]?.enabled,
        },
      }
      setPaymentProviders(updated)
      const supabase = createClient()
      try {
        await supabase
          .from("site_settings")
          .update({ payment_providers: updated })
          .eq("id", 1)
      } catch {
        setPaymentProviders(paymentProviders)
      }
    },
    [paymentProviders],
  )

  const toggleFlag = useCallback(
    async (key: string) => {
      const updated = { ...featureFlags, [key]: !featureFlags[key] }
      setFeatureFlags(updated)
      const supabase = createClient()
      try {
        await supabase
          .from("site_settings")
          .update({ feature_flags: updated })
          .eq("id", 1)
      } catch {
        setFeatureFlags(featureFlags)
      }
    },
    [featureFlags],
  )

  const [uploadError, setUploadError] = useState("")

  const uploadFile = useCallback(async (file: File, folder: string): Promise<string | null> => {
    const supabase = createClient()
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png"
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const path = `${folder}/${safeName}`

    const { error } = await supabase.storage.from("site-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      setUploadError(`Upload failed: ${error.message}`)
      return null
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path)
    setUploadError("")
    return data.publicUrl
  }, [])

  const handleFileUpload = useCallback((target: "logo" | "favicon" | "slide", slideIndex?: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File too large. Maximum size is 5 MB.")
        return
      }

      const key = target === "slide" ? `slide-${slideIndex}` : target
      setUploading(key)
      setUploadError("")

      const url = await uploadFile(file, target === "slide" ? "hero-slides" : "branding")

      if (url) {
        if (target === "logo") setLogoUrl(url)
        else if (target === "favicon") setFaviconUrl(url)
        else if (target === "slide" && slideIndex !== undefined) {
          setHeroContent((prev) => {
            const slides = [...prev.slides]
            slides[slideIndex] = { ...slides[slideIndex], image_url: url }
            return { ...prev, slides }
          })
        }
      }
      setUploading(null)
    }
    input.click()
  }, [uploadFile])

  const saveBranding = useCallback(async () => {
    setSavingBranding(true)
    setSavedBranding(false)
    const supabase = createClient()
    try {
      await supabase
        .from("storefront_settings")
        .update({
          hero_content: heroContent,
          logo_url: logoUrl,
          favicon_url: faviconUrl,
        })
        .eq("id", 1)
      setSavedBranding(true)
      setTimeout(() => setSavedBranding(false), 2000)
    } catch {}
    setSavingBranding(false)
  }, [heroContent, logoUrl, faviconUrl])

  const addSlide = useCallback(() => {
    setHeroContent((prev) => ({
      ...prev,
      slides: [...prev.slides, { image_url: "", alt: "" }],
    }))
  }, [])

  const removeSlide = useCallback((index: number) => {
    setHeroContent((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }))
  }, [])

  const updateSlide = useCallback((index: number, field: keyof HeroSlide, value: string) => {
    setHeroContent((prev) => {
      const slides = [...prev.slides]
      slides[index] = { ...slides[index], [field]: value }
      return { ...prev, slides }
    })
  }, [])

  if (loading) {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <Tabs key={defaultTab} defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="general">
            <Store className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="size-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="features">
            <Flag className="size-4" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Paintbrush className="size-4" />
            Branding & Hero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="mt-4 rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Store Name
                  </label>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Laura's Luxury"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@laurasluxury.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    WhatsApp Number
                  </label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+233..."
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Announcement Bar
                </label>
                <Input
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Free shipping on orders over GH₵ 2,000"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-slate-800">
                    Maintenance Mode
                  </p>
                  <p className="text-sm text-slate-500">
                    Takes the storefront offline for visitors
                  </p>
                </div>
                <Toggle
                  checked={maintenanceMode}
                  onChange={setMaintenanceMode}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={saveGeneral} disabled={saving}>
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : saved ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {PAYMENT_PROVIDERS.map((provider) => (
              <Card key={provider.key} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-5 text-rose-600" />
                      <p className="font-semibold text-slate-800">
                        {provider.label}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {provider.description}
                    </p>
                  </div>
                  <Toggle
                    checked={
                      paymentProviders[provider.key]?.enabled ?? false
                    }
                    onChange={() => toggleProvider(provider.key)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card className="mt-4 rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Feature Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {FEATURE_FLAGS.map((flag) => (
                  <li
                    key={flag.key}
                    className="flex items-center justify-between py-3.5"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {flag.label}
                    </span>
                    <Toggle
                      checked={featureFlags[flag.key] ?? false}
                      onChange={() => toggleFlag(flag.key)}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <div className="mt-4 space-y-6">
            {uploadError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {uploadError}
              </div>
            )}

            {/* Logo & Favicon */}
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Logo & Favicon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Site Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="size-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="size-6 text-slate-300" />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload("logo")}
                          disabled={uploading === "logo"}
                        >
                          {uploading === "logo" ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                          Upload Logo
                        </Button>
                        <Input
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="Or paste image URL…"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Favicon</label>
                    <div className="flex items-center gap-3">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                        {faviconUrl ? (
                          <img src={faviconUrl} alt="Favicon" className="size-8 object-contain" />
                        ) : (
                          <ImageIcon className="size-6 text-slate-300" />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload("favicon")}
                          disabled={uploading === "favicon"}
                        >
                          {uploading === "favicon" ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                          Upload Favicon
                        </Button>
                        <Input
                          value={faviconUrl}
                          onChange={(e) => setFaviconUrl(e.target.value)}
                          placeholder="Or paste image URL…"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hero Content */}
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Hero Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Headline</label>
                    <Input
                      value={heroContent.headline}
                      onChange={(e) => setHeroContent((h) => ({ ...h, headline: e.target.value }))}
                      placeholder="Luxury That Fits Your Everyday"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Subheadline</label>
                    <Input
                      value={heroContent.subheadline}
                      onChange={(e) => setHeroContent((h) => ({ ...h, subheadline: e.target.value }))}
                      placeholder="Bags, shoes, dresses & perfumes…"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Primary CTA Text</label>
                    <Input
                      value={heroContent.cta_primary}
                      onChange={(e) => setHeroContent((h) => ({ ...h, cta_primary: e.target.value }))}
                      placeholder="Shop New Arrivals"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Secondary CTA Text</label>
                    <Input
                      value={heroContent.cta_secondary}
                      onChange={(e) => setHeroContent((h) => ({ ...h, cta_secondary: e.target.value }))}
                      placeholder="Explore Collections"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Slider Images ({heroContent.slides.length})
                    </label>
                    <Button variant="outline" size="sm" onClick={addSlide}>
                      <Plus className="size-3.5" />
                      Add Slide
                    </Button>
                  </div>

                  {heroContent.slides.length === 0 && (
                    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-400">
                      No slides yet. Add at least one slider image.
                    </p>
                  )}

                  <div className="space-y-3">
                    {heroContent.slides.map((slide, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <div
                          className="flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-rose-300 hover:bg-rose-50"
                          onClick={() => handleFileUpload("slide", i)}
                          title="Click to upload image"
                        >
                          {uploading === `slide-${i}` ? (
                            <Loader2 className="size-5 animate-spin text-rose-400" />
                          ) : slide.image_url ? (
                            <img src={slide.image_url} alt={slide.alt} className="size-full rounded-md object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-0.5">
                              <Upload className="size-4 text-slate-400" />
                              <span className="text-[9px] font-medium text-slate-400">Upload</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={slide.image_url}
                              onChange={(e) => updateSlide(i, "image_url", e.target.value)}
                              placeholder="Paste image URL or click thumbnail to upload"
                              className="h-8 text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 shrink-0 text-xs"
                              onClick={() => handleFileUpload("slide", i)}
                              disabled={uploading === `slide-${i}`}
                            >
                              {uploading === `slide-${i}` ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                              Upload
                            </Button>
                          </div>
                          <Input
                            value={slide.alt}
                            onChange={(e) => updateSlide(i, "alt", e.target.value)}
                            placeholder="Alt text (e.g. Luxury fashion)"
                            className="h-8 text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSlide(i)}
                          className="mt-1 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveBranding} disabled={savingBranding}>
                {savingBranding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : savedBranding ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Save className="size-4" />
                )}
                {savingBranding ? "Saving…" : savedBranding ? "Saved" : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
