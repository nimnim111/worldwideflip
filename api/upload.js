import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contentType = req.headers["content-type"];
    if (!contentType) {
      return res.status(400).json({ error: "Missing Content-Type" });
    }

    const blob = await put(
      `backflips/${Date.now()}.mp4`,
      req,
      {
        access: "public",
        contentType,
      }
    );

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
