import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase server client (SERVICE ROLE)
 * ⚠️ Never expose this key to the browser
 */
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { countryCode, fileType } = req.body;

    if (!countryCode || !fileType) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Path inside Supabase Storage bucket
    const path = `${countryCode}/${Date.now()}.mp4`;

    /**
     * Create signed upload URL
     * This MUST return a FULL https:// URL
     */
    const { data, error } = await supabase.storage
      .from("backflips")
      .createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      console.error("SIGN ERROR:", error);
      return res.status(500).json({ error: "Failed to sign upload" });
    }

    return res.status(200).json({
      uploadUrl: data.signedUrl, // ✅ FULL URL
      path,
    });
  } catch (err) {
    console.error("SIGN-UPLOAD CRASH:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
