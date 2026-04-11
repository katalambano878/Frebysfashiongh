import { createClient } from "@/lib/supabase/client"

type UploadTarget = "site-media" | "blog-covers"

const TARGET_FOLDER: Record<UploadTarget, string> = {
  "site-media": "branding",
  "blog-covers": "covers",
}

function buildPath(target: UploadTarget, file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png"
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  return `${TARGET_FOLDER[target]}/${safeName}`
}

export async function uploadImageFile(
  file: File,
  target: UploadTarget,
): Promise<{ url: string | null; error: string | null }> {
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: "File too large. Maximum size is 5 MB." }
  }

  const supabase = createClient()
  const path = buildPath(target, file)
  const { error } = await supabase.storage.from(target).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(target).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
