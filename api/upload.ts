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

  const { countryCode, fileType } = req.body;

  if (!countryCode || !fileType) {
    return res.status(400).send("Missing fields");
  }

  const path = `${countryCode}/${Date.now()}.mp4`;

  const { data, error } = await supabase.storage
    .from("backflips")
    .createSignedUploadUrl(path);

  if (error) {
    console.error(error);
    return res.status(500).send("Failed to create signed upload URL");
  }

  return res.json({
    uploadUrl: data.signedUrl,
    path,
    token: data.token,
  });
}
