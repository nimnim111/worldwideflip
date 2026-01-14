import { handleUpload } from "@vercel/blob/client";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  return handleUpload({
    request: req,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ["video/*"],
        maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
      };
    },
  });
}
