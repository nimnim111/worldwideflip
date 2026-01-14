import { handleUpload } from "@vercel/blob/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    return handleUpload({
        request: req,

        onBeforeGenerateToken: async ({ clientPayload }) => {
            const { email } = JSON.parse(clientPayload || "{}");
            if (!email) throw new Error("Unauthorized");

            return {
                allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
                maxSize: 50 * 1024 * 1024,
            };
        },

        onUploadCompleted: async ({ blob }) => {
            console.log("Upload completed:", blob.url);
        },
    });
}
z
