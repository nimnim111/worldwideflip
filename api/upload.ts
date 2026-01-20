import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import Busboy from "busboy";
import fetch from "node-fetch";

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
      console.log("FILE SIZE:", videoBuffer.length);
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

      /* ============================
       * 1️⃣ CREATE SIGNED UPLOAD URL
       * ============================ */
      const { data: signed, error: signErr } =
        await supabase.storage
          .from("backflips")
          .createSignedUploadUrl(filePath);

      if (signErr || !signed) {
        console.error("SIGNED URL ERROR:", signErr);
        return res.status(500).send("Failed to create signed upload URL");
      }

      /* ============================
       * 2️⃣ SERVER PUT TO SIGNED URL
       * ============================ */
      const putRes = await fetch(signed.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": videoType,
        },
        body: videoBuffer,
      });

      if (!putRes.ok) {
        const text = await putRes.text();
        console.error("SIGNED PUT FAILED:", text);
        return res.status(500).send("Signed upload failed");
      }

      /* ============================
       * 3️⃣ GET FILE URL
       * ============================ */
      const { data: publicData } = supabase.storage
        .from("backflips")
        .getPublicUrl(filePath);

      /* ============================
       * 4️⃣ INSERT METADATA
       * ============================ */
      const { error: dbError } = await supabase
        .from("backflip_videos")
        .insert({
          country_code: countryCode,
          country_name: countryName,
          uploader_email: email,
          uploader_name: uploader,
          video_url: publicData.publicUrl,
          status: "pending",
        });

      if (dbError) {
        console.error("DB INSERT ERROR:", dbError);
        return res.status(500).send(dbError.message);
      }

      return res.json({ url: publicData.publicUrl });
    } catch (err) {
      console.error("UPLOAD CRASH:", err);
      return res.status(500).send("Server error");
    }
  });

  req.pipe(bb);
}
