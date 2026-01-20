import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import Busboy from "busboy";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  console.log("UPLOAD API HIT");

  const bb = Busboy({ headers: req.headers });

  let videoBuffer: Buffer | null = null;
  let videoType = "video/mp4";
  let fields: Record<string, string> = {};

  bb.on("file", (_, file, info) => {
    videoType = info.mimeType || "video/mp4";
    const chunks: Buffer[] = [];
    file.on("data", (d) => chunks.push(d));
    file.on("end", () => {
      videoBuffer = Buffer.concat(chunks);
    });
  });

  bb.on("field", (name, value) => {
    fields[name] = value;
  });

  bb.on("finish", async () => {
    try {
      if (!videoBuffer) {
        return res.status(400).send("No video uploaded");
      }

      const { countryCode, countryName, email, uploader } = fields;

      if (!countryCode || !email) {
        return res.status(400).send("Missing fields");
      }

      const filePath = `${countryCode}/${Date.now()}.mp4`;

      // 1️⃣ Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("backflips")
        .upload(filePath, videoBuffer, {
          contentType: videoType,
          upsert: false,
        });

      if (uploadError) {
        console.error("SUPABASE STORAGE ERROR:", uploadError);
        return res.status(500).send(uploadError.message);
      }

      // 2️⃣ Get public URL
      const { data } = supabase.storage
        .from("backflips")
        .getPublicUrl(filePath);

      // 3️⃣ Insert metadata
      const { error: dbError } = await supabase
        .from("backflip_videos")
        .insert({
          country_code: countryCode,
          country_name: countryName,
          uploader_email: email,
          uploader_name: uploader,
          video_url: data.publicUrl,
          status: "pending",
        });

      if (dbError) {
        console.error("DB INSERT ERROR:", dbError);
        return res.status(500).send(dbError.message);
      }

      return res.json({ url: data.publicUrl });
    } catch (err) {
      console.error("UPLOAD CRASH:", err);
      return res.status(500).send("Server error");
    }
  });

  req.pipe(bb);
}
