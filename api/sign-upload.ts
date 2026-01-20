import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

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
    const { countryCode } = req.body;

    if (!countryCode) {
      return res.status(400).json({ error: "Missing countryCode" });
    }

    const path = `${countryCode}/${Date.now()}.mp4`;

    const { data, error } = await supabase.storage
      .from("backflips")
      .createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      console.error("SIGN-UPLOAD ERROR:", error);
      return res.status(500).json({ error: "Failed to create signed upload URL" });
    }

    return res.status(200).json({
      uploadUrl: data.signedUrl, // ✅ FULL https:// URL
      path,
    });
  } catch (err) {
    console.error("SIGN-UPLOAD CRASH:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
