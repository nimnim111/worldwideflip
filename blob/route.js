import { handleUpload } from "@vercel/blob/client";

export async function POST(request) {
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
//
