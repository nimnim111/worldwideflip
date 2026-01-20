import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { countryCode, countryName, uploader, email, path } = req.body;

  if (!path) {
    return res.status(400).send("Missing storage path");
  }

  const { data: publicData } = supabase.storage
    .from("backflips")
    .getPublicUrl(path);

  const { error } = await supabase.from("backflip_videos").insert({
    country_code: countryCode,
    country_name: countryName,
    uploader_name: uploader,
    uploader_email: email,
    video_url: publicData.publicUrl,
    status: "pending",
  });

  if (error) {
    console.error(error);
    return res.status(500).send("Failed to save metadata");
  }

  return res.json({ ok: true });
}
