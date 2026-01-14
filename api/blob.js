import { handleUpload } from "@vercel/blob/client";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  return handleUpload({
    request,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ["video/*"],
        maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
      };
    },
  });
}
